import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface MovieRating {
  source: 'RottenTomatoesCritic' | 'RottenTomatoesAudience' | 'Letterboxd' | 'IMDB' | 'MetacriticMetascore' | 'MetacriticUser' | 'Trakt';
  score: number; // The actual score from the source
  maxScore: number; // Maximum possible score (e.g., 10 for IMDB, 100 for RT)
}

export interface MovieRatingsData {
  title: string;
  year: number;
  posterSrc: string;
  posterAlt: string;
  ratings: MovieRating[];
  ratingsDate: string; // Date when ratings were captured (e.g., "January 1, 2026")
}

/**
 * Movie Ratings Component
 * Displays compact movie ratings from multiple sources
 */
@Component({
  selector: 'app-movie-ratings',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './movie-ratings.html',
  styleUrl: './movie-ratings.scss',
})
export class MovieRatings {
  @Input({ required: true }) data!: MovieRatingsData;

  /**
   * Get the percentage for a rating (for progress bar)
   */
  getPercentage(rating: MovieRating): number {
    return (rating.score / rating.maxScore) * 100;
  }

  /**
   * Calculate overall score (average of all ratings as percentage)
   */
  getOverallScore(): number {
    if (!this.data.ratings || this.data.ratings.length === 0) {
      return 0;
    }

    const totalPercentage = this.data.ratings.reduce((sum, rating) => {
      return sum + this.getPercentage(rating);
    }, 0);

    return Math.round(totalPercentage / this.data.ratings.length);
  }

  /**
   * Get color class for overall score
   */
  getOverallScoreClass(): string {
    const score = this.getOverallScore();
    if (score >= 75) return 'overall-good';
    if (score >= 50) return 'overall-okay';
    return 'overall-bad';
  }

  /**
   * Get the display text for a rating
   */
  getDisplayText(rating: MovieRating): string {
    if (rating.source === 'IMDB' || rating.source === 'Letterboxd') {
      return `${rating.score}/${rating.maxScore}`;
    }
    return `${rating.score}%`;
  }

  /**
   * Get color class based on percentage
   */
  getRatingClass(rating: MovieRating): string {
    const percentage = this.getPercentage(rating);
    if (percentage >= 75) return 'rating-good';
    if (percentage >= 50) return 'rating-okay';
    return 'rating-bad';
  }

  /**
   * Get source icon/emoji
   */
  getSourceIcon(source: string): string {
    const icons: { [key: string]: string } = {
      'RottenTomatoesCritic': '🍅',
      'RottenTomatoesAudience': '🍿',
      'Letterboxd': '📽️',
      'IMDB': '⭐',
      'MetacriticMetascore': 'Ⓜ️',
      'MetacriticUser': '👥',
      'Trakt': '📺'
    };
    return icons[source] || '📊';
  }

  /**
   * Get display name for source
   */
  getSourceDisplayName(source: string): string {
    const names: { [key: string]: string } = {
      'RottenTomatoesCritic': 'RT Critic',
      'RottenTomatoesAudience': 'RT Audience',
      'Letterboxd': 'Letterboxd',
      'IMDB': 'IMDB',
      'MetacriticMetascore': 'Metacritic',
      'MetacriticUser': 'Metacritic User Score',
      'Trakt': 'Trakt'
    };
    return names[source] || source;
  }
}
