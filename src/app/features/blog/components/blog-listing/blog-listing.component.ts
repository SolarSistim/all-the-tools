import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ArticlePreview, PaginatedResponse } from '../../models/blog.models';
import { BlogService } from '../../services/blog.service';
import { MetaService } from '../../../../core/services/meta.service';
import { StructuredDataService } from '../../../../core/services/structured-data.service';
import { PaginationComponent } from '../pagination/pagination.component';
import { ReadingTimePipe } from '../../pipes/reading-time.pipe';

/**
 * Blog Listing Component
 * Displays paginated list of blog articles
 */
@Component({
  selector: 'app-blog-listing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    PaginationComponent,
    ReadingTimePipe,
  ],
  templateUrl: './blog-listing.component.html',
  styleUrls: ['./blog-listing.component.scss'],
})
export class BlogListingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private blogService = inject(BlogService);
  private metaService = inject(MetaService);
  private structuredDataService = inject(StructuredDataService);
  private destroyRef = inject(DestroyRef);

  articles: ArticlePreview[] = [];
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  pageSize = 10;
  loading = true;
  selectedCategory: string | null = null;
  selectedTag: string | null = null;

  ngOnInit(): void {
    // Watch for query param changes
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.currentPage = Number(params['page']) || 1;
      this.selectedCategory = params['category'] || null;
      this.selectedTag = params['tag'] || null;
      this.loadArticles();
    });

    this.updateMetaTags();
  }

  private loadArticles(): void {
    this.loading = true;

    const filters: any = {};
    if (this.selectedCategory) filters.category = this.selectedCategory;
    if (this.selectedTag) filters.tag = this.selectedTag;

    this.blogService
      .getArticlePreviews(this.currentPage, this.pageSize, filters)
      .subscribe({
        next: (response: PaginatedResponse<ArticlePreview>) => {
          this.articles = response.items;
          this.totalPages = response.totalPages;
          this.totalItems = response.totalItems;
          this.loading = false;
          this.scrollToTop();
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  private updateMetaTags(): void {
    const config = {
      title: 'Blog | All The Things',
      description:
        'Read articles, tutorials, and guides about web development, productivity tools, and more.',
      keywords: [
        'blog',
        'web development',
        'tutorials',
        'guides',
        'productivity',
      ],
      image: this.blogService.getConfig().defaultOgImage,
      url: this.blogService.getListingUrl(this.currentPage),
      type: 'website',
    };

    this.metaService.updateTags(config);
  }

  onPageChange(page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: page > 1 ? page : null,
        category: this.selectedCategory,
        tag: this.selectedTag,
      },
      queryParamsHandling: 'merge',
    });
  }

  filterByCategory(category: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        category,
        page: null,
        tag: null,
      },
    });
  }

  filterByTag(tag: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        tag,
        page: null,
        category: null,
      },
    });
  }

  clearFilters(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
    });
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
