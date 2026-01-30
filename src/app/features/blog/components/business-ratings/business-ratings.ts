import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface BusinessRating {
  source: 'Google' | 'Yelp' | 'Facebook';
  rating: number; // 0-5 star rating
  reviewCount?: number; // Optional review count
}

export interface BusinessRatingsData {
  ratings: BusinessRating[];
}

/**
 * Business Ratings Component
 * Displays star ratings from Google, Yelp, and Facebook
 */
@Component({
  selector: 'app-business-ratings',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './business-ratings.html',
  styleUrl: './business-ratings.scss',
})
export class BusinessRatings {
  @Input({ required: true }) data!: BusinessRatingsData;

  /**
   * Generate array of stars for rating display
   * Returns array of 5 items with fill percentages
   */
  getStars(rating: number): { filled: boolean; partial: number }[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const partialStar = rating - fullStars;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push({ filled: true, partial: 0 });
      } else if (i === fullStars && partialStar > 0) {
        stars.push({ filled: false, partial: partialStar });
      } else {
        stars.push({ filled: false, partial: 0 });
      }
    }

    return stars;
  }

  /**
   * Get platform icon
   */
  getPlatformIcon(source: string): string {
    const icons: { [key: string]: string } = {
      'Google': 'search',
      'Yelp': 'restaurant',
      'Facebook': 'facebook'
    };
    return icons[source] || 'star';
  }

  /**
   * Get platform color class
   */
  getPlatformClass(source: string): string {
    return `platform-${source.toLowerCase()}`;
  }

  /**
   * Format review count
   */
  formatReviewCount(count: number): string {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  }
}
