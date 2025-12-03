import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroImageData } from '../../models/blog.models';

/**
 * Hero Image Component
 * Displays large hero image at the top of articles
 */
@Component({
  selector: 'app-hero-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-image.component.html',
  styleUrls: ['./hero-image.component.scss'],
})
export class HeroImageComponent {
  @Input({ required: true }) image!: HeroImageData;
  @Input() loading: 'eager' | 'lazy' = 'eager';
}
