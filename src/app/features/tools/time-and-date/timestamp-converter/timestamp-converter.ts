import { Component, inject, signal, computed, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MetaService } from '../../../../core/services/meta.service';
import { CustomSnackbarService } from '../../../../core/services/custom-snackbar.service';
import { CtaEmailList } from '../../../reusable-components/cta-email-list/cta-email-list';
import { AdsenseComponent } from '../../../blog/components/adsense/adsense.component';

interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
}

@Component({
  selector: 'app-timestamp-converter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSelectModule,
    CtaEmailList,
    AdsenseComponent
  ],
  templateUrl: './timestamp-converter.html',
  styleUrl: './timestamp-converter.scss',
})
export class TimestampConverter implements OnInit, OnDestroy {
  private metaService = inject(MetaService);
  private snackbar = inject(CustomSnackbarService);
  private platformId = inject(PLATFORM_ID);
  private intervalId?: number;

  // Current timestamp (updates every second)
  currentTimestamp = signal<Date>(new Date());

  // Computed current timestamp values
  currentTimestampSeconds = computed<number>(() =>
    Math.floor(this.currentTimestamp().getTime() / 1000)
  );

  currentTimestampMilliseconds = computed<number>(() =>
    this.currentTimestamp().getTime()
  );

  currentTimestampLocalString = computed<string>(() =>
    this.currentTimestamp().toLocaleString()
  );

  // User input
  timestampInput = signal<string>('');

  // Parsed date from input
  parsedDate = computed<Date | null>(() => {
    const input = this.timestampInput().trim();
    if (!input) return this.currentTimestamp();

    return this.parseTimestamp(input);
  });

  // Selected timezone for display
  selectedTimezone = signal<string>('local');

  // Selected timezone label
  selectedTimezoneLabel = computed<string>(() => {
    const tz = this.timezones.find(t => t.value === this.selectedTimezone());
    return tz ? tz.label : 'Local Time';
  });

  // Selected timezone time
  selectedTimezoneTime = computed<string>(() => {
    const date = this.parsedDate();
    if (!date) return '-';

    if (this.selectedTimezone() === 'local') {
      return date.toLocaleString();
    }

    try {
      return date.toLocaleString('en-US', { timeZone: this.selectedTimezone() });
    } catch {
      return date.toLocaleString();
    }
  });

  // Common timezones
  timezones: TimezoneOption[] = [
    { value: 'local', label: 'Local Time', offset: '' },
    { value: 'UTC', label: 'UTC', offset: '+0:00' },
    { value: 'America/New_York', label: 'Eastern Time (ET)', offset: '-5:00' },
    { value: 'America/Chicago', label: 'Central Time (CT)', offset: '-6:00' },
    { value: 'America/Denver', label: 'Mountain Time (MT)', offset: '-7:00' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)', offset: '-8:00' },
    { value: 'Europe/London', label: 'London (GMT)', offset: '+0:00' },
    { value: 'Europe/Paris', label: 'Paris (CET)', offset: '+1:00' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)', offset: '+9:00' },
    { value: 'Asia/Shanghai', label: 'Shanghai (CST)', offset: '+8:00' },
    { value: 'Asia/Dubai', label: 'Dubai (GST)', offset: '+4:00' },
    { value: 'Australia/Sydney', label: 'Sydney (AEDT)', offset: '+11:00' }
  ];

  // Computed formatted outputs
  unixSeconds = computed<string>(() => {
    const date = this.parsedDate();
    return date ? Math.floor(date.getTime() / 1000).toString() : '-';
  });

  unixMilliseconds = computed<string>(() => {
    const date = this.parsedDate();
    return date ? date.getTime().toString() : '-';
  });

  isoString = computed<string>(() => {
    const date = this.parsedDate();
    return date ? date.toISOString() : '-';
  });

  utcString = computed<string>(() => {
    const date = this.parsedDate();
    return date ? date.toUTCString() : '-';
  });

  localString = computed<string>(() => {
    const date = this.parsedDate();
    return date ? date.toLocaleString() : '-';
  });

  dateOnly = computed<string>(() => {
    const date = this.parsedDate();
    return date ? date.toLocaleDateString() : '-';
  });

  timeOnly = computed<string>(() => {
    const date = this.parsedDate();
    return date ? date.toLocaleTimeString() : '-';
  });

  relativeTime = computed<string>(() => {
    const date = this.parsedDate();
    if (!date) return '-';

    return this.getRelativeTime(date);
  });

  customFormat = computed<string>(() => {
    const date = this.parsedDate();
    if (!date) return '-';

    return this.formatCustom(date);
  });

  constructor() {
    // Update current timestamp every second (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      this.intervalId = window.setInterval(() => {
        this.currentTimestamp.set(new Date());
      }, 1000);
    }
  }

  ngOnInit(): void {
    this.metaService.updateTags({
      title: 'Timestamp Converter - Unix, ISO, UTC Converter',
      description: 'Convert timestamps between Unix epoch, ISO 8601, UTC, and human-readable formats. Parse and convert timestamps instantly with timezone support.',
      keywords: ['timestamp converter', 'unix timestamp', 'epoch converter', 'iso 8601', 'utc time', 'unix time', 'timestamp parser', 'date converter', 'time converter'],
      image: 'https://www.allthethings.dev/meta-images/og-timestamp-converter.png',
      url: 'https://www.allthethings.dev/tools/timestamp-converter',
      jsonLd: this.metaService.buildToolJsonLd({
        name: 'Timestamp Converter - Unix, ISO, UTC Converter',
        description: 'Convert timestamps between Unix epoch, ISO 8601, UTC, and human-readable formats. Parse and convert timestamps instantly with timezone support.',
        url: 'https://www.allthethings.dev/tools/timestamp-converter',
        image: 'https://www.allthethings.dev/meta-images/og-timestamp-converter.png'
      })
    });
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // ============================================
  // TIMESTAMP PARSING
  // ============================================

  /**
   * Parse various timestamp formats
   */
  parseTimestamp(input: string): Date | null {
    if (!input) return null;

    // Try Unix timestamp (seconds) - 10 digits
    if (/^\d{10}$/.test(input)) {
      const timestamp = parseInt(input, 10) * 1000;
      return new Date(timestamp);
    }

    // Try Unix timestamp (milliseconds) - 13 digits
    if (/^\d{13}$/.test(input)) {
      const timestamp = parseInt(input, 10);
      return new Date(timestamp);
    }

    // Try parsing as date string (ISO, RFC, etc.)
    const date = new Date(input);
    if (!isNaN(date.getTime())) {
      return date;
    }

    return null;
  }

  /**
   * Get relative time string (e.g., "2 hours ago")
   */
  getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffWeek = Math.floor(diffDay / 7);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    const future = diffMs < 0;
    const absDiffSec = Math.abs(diffSec);
    const absDiffMin = Math.abs(diffMin);
    const absDiffHour = Math.abs(diffHour);
    const absDiffDay = Math.abs(diffDay);
    const absDiffWeek = Math.abs(diffWeek);
    const absDiffMonth = Math.abs(diffMonth);
    const absDiffYear = Math.abs(diffYear);

    if (absDiffSec < 60) {
      return future ? `in ${absDiffSec} seconds` : `${absDiffSec} seconds ago`;
    } else if (absDiffMin < 60) {
      return future ? `in ${absDiffMin} minutes` : `${absDiffMin} minutes ago`;
    } else if (absDiffHour < 24) {
      return future ? `in ${absDiffHour} hours` : `${absDiffHour} hours ago`;
    } else if (absDiffDay < 7) {
      return future ? `in ${absDiffDay} days` : `${absDiffDay} days ago`;
    } else if (absDiffWeek < 4) {
      return future ? `in ${absDiffWeek} weeks` : `${absDiffWeek} weeks ago`;
    } else if (absDiffMonth < 12) {
      return future ? `in ${absDiffMonth} months` : `${absDiffMonth} months ago`;
    } else {
      return future ? `in ${absDiffYear} years` : `${absDiffYear} years ago`;
    }
  }

  /**
   * Format date in custom format
   */
  formatCustom(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // ============================================
  // USER ACTIONS
  // ============================================

  /**
   * Use current timestamp
   */
  useCurrentTimestamp(): void {
    const now = new Date();
    this.timestampInput.set(Math.floor(now.getTime() / 1000).toString());
  }

  /**
   * Clear input
   */
  clearInput(): void {
    this.timestampInput.set('');
  }

  /**
   * Copy text to clipboard
   */
  async copyToClipboard(text: string, label: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      this.snackbar.success(`${label} copied to clipboard!`, 2000);
    } catch (err) {
      this.snackbar.error('Failed to copy to clipboard', 2000);
    }
  }

  /**
   * Copy specific format
   */
  async copyUnixSeconds(): Promise<void> {
    await this.copyToClipboard(this.unixSeconds(), 'Unix timestamp (seconds)');
  }

  async copyUnixMilliseconds(): Promise<void> {
    await this.copyToClipboard(this.unixMilliseconds(), 'Unix timestamp (milliseconds)');
  }

  async copyISO(): Promise<void> {
    await this.copyToClipboard(this.isoString(), 'ISO 8601');
  }

  async copyUTC(): Promise<void> {
    await this.copyToClipboard(this.utcString(), 'UTC string');
  }

  async copyLocal(): Promise<void> {
    await this.copyToClipboard(this.localString(), 'Local string');
  }

  async copyCustom(): Promise<void> {
    await this.copyToClipboard(this.customFormat(), 'Custom format');
  }

  /**
   * Scroll to converter section
   */
  scrollToConverter(): void {
    const element = document.querySelector('.converter-card');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}