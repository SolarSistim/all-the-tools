import { Component, OnInit, inject, DestroyRef, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
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
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatTooltipModule,
    FormsModule,
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
  private platformId = inject(PLATFORM_ID);

  articles: ArticlePreview[] = [];
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  pageSize = 9;
  loading = true;
  selectedCategory: string | null = null;
  selectedTag: string | null = null;
  searchQuery = signal('');
  allArticles: ArticlePreview[] = [];
  filteredArticles = signal<ArticlePreview[]>([]);
  viewMode: 'tile' | 'list' = 'tile';
  categories: string[] = [];

  ngOnInit(): void {
    // Load view mode from localStorage (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      const savedViewMode = localStorage.getItem('blog-view-mode');
      if (savedViewMode === 'list' || savedViewMode === 'tile') {
        this.viewMode = savedViewMode;
      }
    }
    // Load all articles for search autocomplete
    this.blogService.getArticlePreviews(1, 1000).subscribe({
      next: (response) => {
        this.allArticles = response.items;
        // Extract unique categories
        this.categories = [...new Set(this.allArticles.map(article => article.category))].sort();
      },
    });

    // Watch for query param changes (only for pagination)
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const newPage = Number(params['page']) || 1;
      const pageChanged = newPage !== this.currentPage;
      this.currentPage = newPage;
      this.loadArticles(pageChanged);
    });

    this.updateMetaTags();
  }

  private loadArticles(shouldScrollToTop: boolean = false): void {
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
          if (shouldScrollToTop) {
            this.scrollToTop();
          }
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
    this.selectedCategory = category;
    this.selectedTag = null;
    this.currentPage = 1;
    this.loadArticles(false);
  }

  filterByTag(tag: string): void {
    this.selectedTag = tag;
    this.selectedCategory = null;
    this.currentPage = 1;
    this.loadArticles(false);
  }

  clearFilters(): void {
    this.selectedCategory = null;
    this.selectedTag = null;
    this.currentPage = 1;
    this.loadArticles(false);
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

  onSearchInput(value: string): void {
    this.searchQuery.set(value);

    if (value.trim() === '') {
      this.filteredArticles.set([]);
      return;
    }

    const query = value.toLowerCase();
    const filtered = this.allArticles.filter(article =>
      article.title.toLowerCase().includes(query) ||
      article.description.toLowerCase().includes(query) ||
      article.tags.some(tag => tag.toLowerCase().includes(query))
    ).slice(0, 10); // Limit to 10 results

    this.filteredArticles.set(filtered);
  }

  onArticleSelected(article: ArticlePreview): void {
    this.searchQuery.set('');
    this.filteredArticles.set([]);
    this.router.navigate(['/blog', article.slug]);
  }

  displayArticle(article: ArticlePreview | null): string {
    return article ? article.title : '';
  }

  setViewMode(mode: 'tile' | 'list'): void {
    this.viewMode = mode;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('blog-view-mode', mode);
    }
  }
}
