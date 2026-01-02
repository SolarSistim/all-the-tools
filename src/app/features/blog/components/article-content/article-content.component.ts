import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ContentBlock } from '../../models/blog.models';
import { ArticleImageComponent } from '../article-image/article-image.component';
import { ImageGalleryComponent } from '../image-gallery/image-gallery.component';
import { BlockquoteComponent } from '../blockquote/blockquote.component';
import { CodeBlockComponent } from '../code-block/code-block.component';
import { AffiliateLinkComponent } from '../affiliate-link/affiliate-link.component';
import { AdsenseComponent } from '../adsense/adsense.component';
import { MoviePoster } from '../movie-poster/movie-poster';
import { MovieRatings } from '../movie-ratings/movie-ratings';
import { VideoEmbedComponent } from '../video-embed/video-embed.component';
import { RokuProgrammaticCompatibilityChecker } from '../../../tools/hardware/roku-compatibility-checker/roku-programmatic-compatibility-checker/roku-programmatic-compatibility-checker';

/**
 * Article Content Component
 * Dynamically renders article content blocks
 */
@Component({
  selector: 'app-article-content',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    ArticleImageComponent,
    ImageGalleryComponent,
    BlockquoteComponent,
    CodeBlockComponent,
    AffiliateLinkComponent,
    AdsenseComponent,
    MoviePoster,
    MovieRatings,
    VideoEmbedComponent,
    RokuProgrammaticCompatibilityChecker,
  ],
  templateUrl: './article-content.component.html',
  styleUrls: ['./article-content.component.scss'],
})
export class ArticleContentComponent {
  @Input({ required: true }) blocks!: ContentBlock[];

  /**
   * Generate ID for headings (for anchor links)
   */
  generateId(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
