import { Component, OnInit, inject, PLATFORM_ID, RESPONSE_INIT } from '@angular/core';
import { CommonModule, isPlatformServer } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { BLOG_ARTICLES_METADATA, ArticleMetadata } from '../blog/data/articles-metadata.data';
import { MetaService } from '../../core/services/meta.service';

/**
 * 404 Not Found Page
 * Displays when user navigates to non-existent route
 */
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private metaService = inject(MetaService);
  latestPosts: ArticleMetadata[] = [];

  constructor() {
    // Set 404 status code for SSR
    if (isPlatformServer(this.platformId)) {
      const responseInit = inject(RESPONSE_INIT, { optional: true });
      if (responseInit) {
        responseInit.status = 404;
        responseInit.statusText = 'Not Found';
      }
    }
  }

  ngOnInit(): void {
    this.updateMetaTags();
    this.loadLatestPosts();
  }

  private updateMetaTags(): void {
    this.metaService.updateTags({
      title: '404 - Page Not Found | AllTheTools.dev',
      description: 'The page you\'re looking for doesn\'t exist. Check out our latest articles or return to the homepage.',
      keywords: ['404', 'not found', 'error'],
    });
  }

  private loadLatestPosts(): void {
    // Get the 3 most recent blog posts
    this.latestPosts = BLOG_ARTICLES_METADATA
      .filter(article => article.display !== false)
      .sort((a, b) => {
        const dateA = new Date(a.publishedDate);
        const dateB = new Date(b.publishedDate);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 3);
  }
}
