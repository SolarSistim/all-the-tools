import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
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

  isCtrlPressed = false;

  platforms = Object.values(PLATFORM_CONFIGS);

  groupedPlatforms = [
    {
      label: 'No Hashtags',
      platforms: this.platforms.filter(p => p.hashtagRecommendation.max === 0)
    },
    {
      label: 'Few Hashtags (1-3)',
      platforms: this.platforms.filter(p => p.hashtagRecommendation.max > 0 && p.hashtagRecommendation.max <= 3)
    },
    {
      label: 'Regular Use (4-10)',
      platforms: this.platforms.filter(p => p.hashtagRecommendation.max > 3 && p.hashtagRecommendation.max <= 10)
    },
    {
      label: 'High Hashtags (10+)',
      platforms: this.platforms.filter(p => p.hashtagRecommendation.max > 10)
    }
  ].filter(group => group.platforms.length > 0);

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey) {
      this.isCtrlPressed = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent): void {
    if (!event.ctrlKey && !event.metaKey) {
      this.isCtrlPressed = false;
    }
  }

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

  getPlatformHomeUrl(platformId: PlatformId): string {
    return PLATFORM_CONFIGS[platformId].homeUrl;
  }

  onPlatformToggle(platformId: PlatformId, event: MouseEvent): void {
    if (event.ctrlKey || event.metaKey) {
      window.open(this.getPlatformHomeUrl(platformId), '_blank');
      return;
    }
    this.platformToggle.emit(platformId);
  }

  onPlatformClick(platformId: PlatformId, event: MouseEvent): void {
    if (event.ctrlKey || event.metaKey) {
      window.open(this.getPlatformHomeUrl(platformId), '_blank');
      return;
    }
    if (this.isPlatformSelected(platformId)) {
      event.stopPropagation();
      this.platformClick.emit(platformId);
    }
  }
}
