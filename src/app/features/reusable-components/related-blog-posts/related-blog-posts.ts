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
 * Displays related blog posts with attractive styling
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
}
