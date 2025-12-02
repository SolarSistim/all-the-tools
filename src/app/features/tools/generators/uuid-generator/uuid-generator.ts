import { Component, inject, signal, effect, untracked, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';
import { MetaService } from '../../../../core/services/meta.service';

@Component({
  selector: 'app-uuid-generator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatRadioModule,
    MatSliderModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTooltipModule,
    PageHeaderComponent
  ],
  templateUrl: './uuid-generator.html',
  styleUrl: './uuid-generator.scss',
})
export class UuidGenerator implements OnInit {
  private metaService = inject(MetaService);
  private snackBar = inject(MatSnackBar);

  // Signals for UUID options
  selectedVersion = signal<'v4' | 'v1' | 'nil'>('v4');
  selectedFormat = signal<'standard' | 'no-hyphens' | 'uppercase' | 'braces' | 'urn'>('standard');
  uuidCount = signal<number>(5);

  // Generated UUIDs
  generatedUUID = signal<string>('');
  uuidHistory = signal<string[]>([]);

  constructor() {
    // Auto-regenerate UUID when options change
    effect(() => {
      this.selectedVersion();
      this.selectedFormat();

      untracked(() => {
        this.generateSingleUUID();
      });
    });
  }

  ngOnInit(): void {
    this.metaService.updateTags({
      title: 'UUID Generator',
      description: 'Generate universally unique identifiers (UUIDs) with different versions and formats. Support for UUID v1, v4, and various output formats.',
      keywords: ['uuid generator', 'guid generator', 'unique id', 'uuid v4', 'uuid v1', 'random uuid'],
      image: 'https://www.allthethings.dev/meta-images/og-uuid-generator.png',
      url: 'https://www.allthethings.dev/tools/uuid-generator'
    });

    // Generate initial UUID
    this.generateSingleUUID();
  }

  /**
   * Generate a single UUID
   */
  generateSingleUUID(): void {
    let uuid = '';

    switch (this.selectedVersion()) {
      case 'v4':
        uuid = this.generateV4();
        break;
      case 'v1':
        uuid = this.generateV1();
        break;
      case 'nil':
        uuid = this.generateNil();
        break;
    }

    // Apply formatting
    uuid = this.applyFormat(uuid);

    this.generatedUUID.set(uuid);

    // Add to history (keep last 50)
    if (uuid) {
      const history = [uuid, ...this.uuidHistory()].slice(0, 50);
      this.uuidHistory.set(history);
    }
  }

  /**
   * Generate multiple UUIDs
   */
  generateMultiple(): void {
    const count = this.uuidCount();
    const uuids: string[] = [];

    for (let i = 0; i < count; i++) {
      let uuid = '';
      
      switch (this.selectedVersion()) {
        case 'v4':
          uuid = this.generateV4();
          break;
        case 'v1':
          uuid = this.generateV1();
          break;
        case 'nil':
          uuid = this.generateNil();
          break;
      }

      uuid = this.applyFormat(uuid);
      uuids.push(uuid);
    }

    // Add all to history
    const history = [...uuids, ...this.uuidHistory()].slice(0, 50);
    this.uuidHistory.set(history);

    this.snackBar.open(`Generated ${count} UUID${count > 1 ? 's' : ''}`, 'Close', {
      duration: 2000
    });
  }

  /**
   * Generate UUID v4 (Random)
   */
  private generateV4(): string {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);

    // Set version (4) and variant bits
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10

    return this.bytesToUUID(bytes);
  }

  /**
   * Generate UUID v1 (Timestamp-based)
   */
  private generateV1(): string {
    // Get current timestamp (in 100-nanosecond intervals since Oct 15, 1582)
    const timestamp = Date.now();
    const gregorianOffset = 12219292800000; // Offset to Gregorian epoch
    const timeInGregorian = timestamp + gregorianOffset;
    const time100ns = timeInGregorian * 10000;

    // Split timestamp into components
    const timeLow = time100ns & 0xffffffff;
    const timeMid = (time100ns >> 32) & 0xffff;
    const timeHigh = ((time100ns >> 48) & 0x0fff) | 0x1000; // Version 1

    // Generate random clock sequence and node (MAC address simulation)
    const clockSeq = this.getSecureRandomInt(0, 0x3fff) | 0x8000; // Variant 10
    const node = new Uint8Array(6);
    crypto.getRandomValues(node);
    node[0] |= 0x01; // Set multicast bit

    // Build UUID string
    const hex = (n: number, len: number) => n.toString(16).padStart(len, '0');
    
    return `${hex(timeLow, 8)}-${hex(timeMid, 4)}-${hex(timeHigh, 4)}-${hex(clockSeq, 4)}-${Array.from(node).map(b => hex(b, 2)).join('')}`;
  }

  /**
   * Generate Nil UUID (all zeros)
   */
  private generateNil(): string {
    return '00000000-0000-0000-0000-000000000000';
  }

  /**
   * Convert bytes to UUID string
   */
  private bytesToUUID(bytes: Uint8Array): string {
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20, 32)}`;
  }

  /**
   * Apply selected format to UUID
   */
  private applyFormat(uuid: string): string {
    switch (this.selectedFormat()) {
      case 'no-hyphens':
        return uuid.replace(/-/g, '');
      case 'uppercase':
        return uuid.toUpperCase();
      case 'braces':
        return `{${uuid}}`;
      case 'urn':
        return `urn:uuid:${uuid}`;
      default:
        return uuid;
    }
  }

  /**
   * Get cryptographically secure random integer
   */
  private getSecureRandomInt(min: number, max: number): number {
    const range = max - min;
    const randomValues = new Uint32Array(1);
    crypto.getRandomValues(randomValues);
    return min + (randomValues[0] % range);
  }

  /**
   * Copy UUID to clipboard
   */
  async copyToClipboard(uuid: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(uuid);
      this.snackBar.open('UUID copied to clipboard!', 'Close', {
        duration: 2000
      });
    } catch (err) {
      this.snackBar.open('Failed to copy to clipboard', 'Close', {
        duration: 2000
      });
    }
  }

  /**
   * Copy all UUIDs to clipboard
   */
  async copyAllToClipboard(): Promise<void> {
    try {
      const allUUIDs = this.uuidHistory().join('\n');
      await navigator.clipboard.writeText(allUUIDs);
      this.snackBar.open(`Copied ${this.uuidHistory().length} UUIDs to clipboard!`, 'Close', {
        duration: 2000
      });
    } catch (err) {
      this.snackBar.open('Failed to copy to clipboard', 'Close', {
        duration: 2000
      });
    }
  }

  /**
   * Clear UUID history
   */
  clearHistory(): void {
    this.uuidHistory.set([]);
    this.snackBar.open('History cleared', 'Close', {
      duration: 2000
    });
  }

  /**
   * Format slider label
   */
  formatLabel(value: number): string {
    return `${value}`;
  }

  /**
   * Update UUID count
   */
  updateUUIDCount(value: number): void {
    this.uuidCount.set(value);
  }

  /**
   * Scroll to options section
   */
  scrollToOptions(): void {
    const optionsCard = document.querySelector('.config-card');
    if (optionsCard) {
      optionsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

    scrollToGenerator(): void {
    const element = document.querySelector('.cta-button');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

}