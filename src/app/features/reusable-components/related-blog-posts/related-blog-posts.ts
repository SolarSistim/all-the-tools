import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

export interface RelatedBlogPost {
  title: string;
  slug: string;
}

/**
 * Related Blog Posts Component
 * Displays related blog posts and tools with attractive styling
 */
@Component({
  selector: 'app-related-blog-posts',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './related-blog-posts.html',
  styleUrl: './related-blog-posts.scss',
})
export class RelatedBlogPosts {
  @Input({ required: true }) posts: RelatedBlogPost[] = [];

  /**
   * Generate router link based on slug type
   * If slug starts with /tools/, route to that path directly
   * Otherwise, route to /blog/{slug}
   */
  getRouterLink(slug: string): string[] {
    if (slug.startsWith('/tools/')) {
      return [slug];
    }
    return ['/blog', slug];
  }
}
