import { Injectable } from '@angular/core';
import { PLATFORM_CONFIGS, PlatformId, PlatformStatus } from '../models/platform.model';

@Injectable({
  providedIn: 'root'
})
export class PlatformFormatterService {
  constructor() {}

  /**
   * Calculates character count for a platform, accounting for URL character rules
   */
  calculateCharacterCount(
    description: string,
    hashtags: string[],
    url: string,
    platformId: PlatformId
  ): number {
    const config = PLATFORM_CONFIGS[platformId];

    // Calculate description length
    let count = description.length;

    // Add hashtag length (with spaces)
    if (hashtags.length > 0) {
      const hashtagString = ' ' + hashtags.join(' ');
      count += hashtagString.length;
    }

    // Add URL length
    if (url) {
      const urlLength = config.urlCharsCountedAs === 'actual'
        ? url.length
        : config.urlCharsCountedAs;
      count += urlLength + 1; // +1 for space before URL
    }

    return count;
  }

  /**
   * Formats content for a specific platform
   */
  formatForPlatform(
    description: string,
    hashtags: string[],
    url: string,
    platformId: PlatformId
  ): string {
    let formatted = description;

    // Add hashtags
    if (hashtags.length > 0) {
      formatted += '\n\n' + hashtags.join(' ');
    }

    // Add URL
    if (url) {
      formatted += '\n\n' + url;
    }

    return formatted;
  }

  /**
   * Gets platform status including character count and warnings
   */
  getPlatformStatus(
    description: string,
    hashtags: string[],
    url: string,
    platformId: PlatformId
  ): PlatformStatus {
    const config = PLATFORM_CONFIGS[platformId];
    const characterCount = this.calculateCharacterCount(description, hashtags, url, platformId);
    const isOverLimit = characterCount > config.charLimit;
    const percentage = (characterCount / config.charLimit) * 100;

    // Check hashtag recommendations
    const hashtagWarning = this.hasHashtagWarning(hashtags.length, platformId);

    return {
      platform: platformId,
      characterCount,
      isOverLimit,
      hashtagWarning,
      percentage
    };
  }

  /**
   * Gets status for all selected platforms
   */
  getAllPlatformStatuses(
    description: string,
    hashtags: string[],
    url: string,
    selectedPlatforms: PlatformId[]
  ): PlatformStatus[] {
    return selectedPlatforms.map(platformId =>
      this.getPlatformStatus(description, hashtags, url, platformId)
    );
  }

  /**
   * Gets the most restrictive platform (lowest character limit)
   */
  getMostRestrictivePlatform(selectedPlatforms: PlatformId[]): PlatformId | null {
    if (selectedPlatforms.length === 0) return null;

    return selectedPlatforms.reduce((mostRestrictive, current) => {
      const currentLimit = PLATFORM_CONFIGS[current].charLimit;
      const mostRestrictiveLimit = PLATFORM_CONFIGS[mostRestrictive].charLimit;
      return currentLimit < mostRestrictiveLimit ? current : mostRestrictive;
    });
  }

  /**
   * Checks if hashtag count is within recommended range
   */
  hasHashtagWarning(hashtagCount: number, platformId: PlatformId): boolean {
    const config = PLATFORM_CONFIGS[platformId];
    const { min, max } = config.hashtagRecommendation;

    // If min and max are both 0, no hashtags are recommended
    if (min === 0 && max === 0) {
      return hashtagCount > 0;
    }

    return hashtagCount < min || hashtagCount > max;
  }

  /**
   * Gets hashtag recommendation message for a platform
   */
  getHashtagRecommendation(platformId: PlatformId, currentCount: number): string {
    const config = PLATFORM_CONFIGS[platformId];
    const { min, max } = config.hashtagRecommendation;

    if (min === 0 && max === 0) {
      return currentCount > 0
        ? `${config.name}: Hashtags not commonly used`
        : `${config.name}: ✓ Optimal`;
    }

    if (currentCount < min) {
      return `${config.name}: Add ${min - currentCount} more (${min}-${max} recommended)`;
    } else if (currentCount > max) {
      return `${config.name}: ⚠ Remove ${currentCount - max} (${min}-${max} recommended)`;
    } else {
      return `${config.name}: ✓ Optimal (${min}-${max})`;
    }
  }

  /**
   * Gets all hashtag recommendations for selected platforms
   */
  getAllHashtagRecommendations(
    selectedPlatforms: PlatformId[],
    currentCount: number
  ): string[] {
    return selectedPlatforms.map(platformId =>
      this.getHashtagRecommendation(platformId, currentCount)
    );
  }

  /**
   * Formats hashtags according to user preferences
   */
  formatHashtag(tag: string, lowercase: boolean = false): string {
    // Remove all whitespace
    let formatted = tag.replace(/\s/g, '');

    // Add # prefix if missing
    if (!formatted.startsWith('#')) {
      formatted = '#' + formatted;
    }

    // Convert to lowercase if requested
    if (lowercase) {
      formatted = formatted.toLowerCase();
    }

    return formatted;
  }

  /**
   * Formats multiple hashtags
   */
  formatHashtags(tags: string[], lowercase: boolean = false): string[] {
    return tags.map(tag => this.formatHashtag(tag, lowercase));
  }
}
