import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageBlock } from '../../models/blog.models';

/**
 * Article Image Component
 * Displays inline images within article content
 */
@Component({
  selector: 'app-article-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './article-image.component.html',
  styleUrls: ['./article-image.component.scss'],
})
export class ArticleImageComponent {
  @Input({ required: true }) data!: ImageBlock['data'];
  @Input() loading: 'eager' | 'lazy' = 'lazy';
}
