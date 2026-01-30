import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ContentBlock } from '../../models/blog.models';
import { ImageGalleryComponent } from '../image-gallery/image-gallery.component';
import { BlockquoteComponent } from '../blockquote/blockquote.component';
import { CodeBlockComponent } from '../code-block/code-block.component';
import { AffiliateLinkComponent } from '../affiliate-link/affiliate-link.component';
import { AdsenseComponent } from '../adsense/adsense.component';
import { MoviePoster } from '../movie-poster/movie-poster';
import { MovieRatings } from '../movie-ratings/movie-ratings';
import { BusinessRatings } from '../business-ratings/business-ratings';
import { VideoEmbedComponent } from '../video-embed/video-embed.component';
import { AudioPlayerComponent } from '../audio-player/audio-player.component';
import { YoutubePlayerComponent } from '../youtube-player/youtube-player.component';
import { RokuProgrammaticCompatibilityChecker } from '../../../tools/hardware/roku-compatibility-checker/roku-programmatic-compatibility-checker/roku-programmatic-compatibility-checker';
import { CtaEmailList } from '../../../reusable-components/cta-email-list/cta-email-list';
import { AlertPrimary } from '../../../reusable-components/alerts/alert-primary/alert-primary';
import { AlertSuccess } from '../../../reusable-components/alerts/alert-success/alert-success';
import { AlertWarning } from '../../../reusable-components/alerts/alert-warning/alert-warning';
import { AlertDanger } from '../../../reusable-components/alerts/alert-danger/alert-danger';
import { RelatedBlogPosts } from '../../../reusable-components/related-blog-posts/related-blog-posts';
import { SnowGlobeShake } from '../../../art/snow-globe-shake/snow-globe-shake';

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
    ImageGalleryComponent,
    BlockquoteComponent,
    CodeBlockComponent,
    AffiliateLinkComponent,
    AdsenseComponent,
    MoviePoster,
    MovieRatings,
    BusinessRatings,
    VideoEmbedComponent,
    AudioPlayerComponent,
    YoutubePlayerComponent,
    RokuProgrammaticCompatibilityChecker,
    CtaEmailList,
    AlertPrimary,
    AlertSuccess,
    AlertWarning,
    AlertDanger,
    RelatedBlogPosts,
    SnowGlobeShake,
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

  /**
   * TrackBy function for ngFor to improve performance and hydration
   */
  trackByIndex(index: number): number {
    return index;
  }
}
