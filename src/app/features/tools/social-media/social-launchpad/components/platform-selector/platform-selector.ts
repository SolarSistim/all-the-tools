import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { ThemePalette } from '@angular/material/core';
import { PLATFORM_CONFIGS, PlatformId, PlatformStatus } from '../../models/platform.model';

@Component({
  selector: 'app-platform-selector',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatBadgeModule
  ],
  templateUrl: './platform-selector.html',
  styleUrl: './platform-selector.scss'
})
export class PlatformSelectorComponent {
  @Input() selectedPlatforms: PlatformId[] = [];
  @Input() platformStatuses: Map<PlatformId, PlatformStatus> = new Map();
  @Output() platformToggle = new EventEmitter<PlatformId>();
  @Output() platformClick = new EventEmitter<PlatformId>();

  platforms = Object.values(PLATFORM_CONFIGS);

  isPlatformSelected(platformId: PlatformId): boolean {
    return this.selectedPlatforms.includes(platformId);
  }

  getPlatformStatus(platformId: PlatformId): PlatformStatus | undefined {
    return this.platformStatuses.get(platformId);
  }

  getStatusBadgeColor(platformId: PlatformId): ThemePalette {
    const status = this.getPlatformStatus(platformId);
    if (!status) return undefined;

    if (status.isOverLimit) return 'warn';
    if (status.hashtagWarning) return 'accent';
    return 'primary';
  }

  hasWarning(platformId: PlatformId): boolean {
    const status = this.getPlatformStatus(platformId);
    return !!(status && (status.isOverLimit || status.hashtagWarning));
  }

  getStatusClass(platformId: PlatformId): string {
    const status = this.getPlatformStatus(platformId);
    if (!status) return '';

    if (status.isOverLimit) {
      return 'status-error';
    } else {
      return 'status-success';
    }
  }

  getTooltipText(platformId: PlatformId): string {
    const config = PLATFORM_CONFIGS[platformId];
    const status = this.getPlatformStatus(platformId);

    let tooltip = `${config.name}\nChar limit: ${config.charLimit}`;

    if (status) {
      tooltip += `\nCurrent: ${status.characterCount}`;
      if (status.isOverLimit) {
        tooltip += `\n⚠ Over limit by ${status.characterCount - config.charLimit}`;
      }
    }

    return tooltip;
  }

  onPlatformToggle(platformId: PlatformId): void {
    this.platformToggle.emit(platformId);
  }

  onPlatformClick(platformId: PlatformId, event: Event): void {
    if (this.isPlatformSelected(platformId)) {
      event.stopPropagation();
      this.platformClick.emit(platformId);
    }
  }
}
