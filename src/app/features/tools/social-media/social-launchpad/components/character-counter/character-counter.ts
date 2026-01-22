import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PLATFORM_CONFIGS, PlatformStatus, PlatformId } from '../../models/platform.model';

@Component({
  selector: 'app-character-counter',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './character-counter.html',
  styleUrl: './character-counter.scss'
})
export class CharacterCounterComponent implements OnChanges {
  @Input() platformStatuses: PlatformStatus[] = [];
  @Input() hashtagCount: number = 0;

  mostRestrictive: PlatformStatus | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['platformStatuses']) {
      this.updateMostRestrictive();
    }
  }

  private updateMostRestrictive(): void {
    if (this.platformStatuses.length === 0) {
      this.mostRestrictive = null;
      return;
    }

    this.mostRestrictive = this.platformStatuses.reduce((mostRestrictive, current) => {
      const currentLimit = PLATFORM_CONFIGS[current.platform].charLimit;
      const mostRestrictiveLimit = PLATFORM_CONFIGS[mostRestrictive.platform].charLimit;
      return currentLimit < mostRestrictiveLimit ? current : mostRestrictive;
    });
  }

  getPlatformName(status: PlatformStatus): string {
    return PLATFORM_CONFIGS[status.platform].name;
  }

  getPlatformLimit(status: PlatformStatus): number {
    return PLATFORM_CONFIGS[status.platform].charLimit;
  }

  getProgressColor(status: PlatformStatus): string {
    if (status.isOverLimit) {
      return 'warn';
    } else {
      return 'primary';
    }
  }

  getStatusIcon(status: PlatformStatus): string {
    if (status.isOverLimit) {
      return 'error';
    } else if (status.hashtagWarning) {
      return 'warning';
    } else {
      return 'check_circle';
    }
  }

  getStatusClass(status: PlatformStatus): string {
    if (status.isOverLimit) {
      return 'status-error';
    } else {
      return 'status-success';
    }
  }

  getOverLimitAmount(status: PlatformStatus): number {
    const limit = this.getPlatformLimit(status);
    return status.characterCount - limit;
  }

  getHashtagRecommendation(platformId: PlatformId): string {
    const config = PLATFORM_CONFIGS[platformId];
    const { min, max } = config.hashtagRecommendation;

    if (min === 0 && max === 0) {
      return `${this.hashtagCount} hashtags (not recommended for this platform)`;
    }

    return `${this.hashtagCount} hashtags (recommended: ${min}-${max})`;
  }

  isMostRestrictive(status: PlatformStatus): boolean {
    return this.mostRestrictive?.platform === status.platform;
  }
}
