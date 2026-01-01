import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

/**
 * Movie Poster Component
 * Displays a movie poster that floats left with text wrapping around it
 * Includes lightbox functionality on click
 */
@Component({
  selector: 'app-movie-poster',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './movie-poster.html',
  styleUrl: './movie-poster.scss',
})
export class MoviePoster {
  @Input({ required: true }) src!: string;
  @Input({ required: true }) alt!: string;
  @Input() caption?: string;
  @Input() width: number = 400;
  @Input() height: number = 600;
  @Input() loading: 'eager' | 'lazy' = 'lazy';

  lightboxOpen = false;

  openLightbox(): void {
    this.lightboxOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
    document.body.style.overflow = '';
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('lightbox')) {
      this.closeLightbox();
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (!this.lightboxOpen) return;

    if (event.key === 'Escape') {
      this.closeLightbox();
    }
  }
}
