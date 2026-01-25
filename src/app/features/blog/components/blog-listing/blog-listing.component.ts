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
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ArticlePreview, PaginatedResponse } from '../../models/blog.models';
import { BlogService } from '../../services/blog.service';
import { MetaService } from '../../../../core/services/meta.service';
import { StructuredDataService } from '../../../../core/services/structured-data.service';
import { PaginationComponent } from '../pagination/pagination.component';
import { ReadingTimePipe } from '../../pipes/reading-time.pipe';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';

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
    MatSelectModule,
    FormsModule,
    PaginationComponent,
    ReadingTimePipe,
    PageHeaderComponent,
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

  // Featured tutorials for internal linking
  featuredTutorials = [
    { slug: 'how-to-use-social-media-launchpad-copy-paste-launch', title: 'How to Use the Social Media Launchpad' },
    { slug: 'base-number-converter-tutorial', title: 'Base Number Converter Tutorial' },
    { slug: 'stop-typing-in-those-tiny-on-reward-codes-by-hand', title: 'Automate On! Reward Code Scanning' }
  ];

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
          // Update structured data with new article list
          this.addStructuredData();
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
      title: 'Web Dev Guides & Tutorials — All The Things Blog',
      description:
        'Explore blog posts on web development, coding tips, tool tutorials, and practical guides for developers and creators. Stay up to date with in-depth content and how-tos.',
      keywords: [
        'blog',
        'web development',
        'tutorials',
        'guides',
        'coding tips',
        'developer guides',
        'tool tutorials',
      ],
      image: 'https://ik.imagekit.io/allthethingsdev/Blog%20OG%20Header%20Image/allthethings-tutorials-and-blog.jpg',
      url: 'https://www.allthethings.dev/blog',
      type: 'website',
    };

    this.metaService.updateTags(config);
    this.addStructuredData();
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

  onCategoryDropdownChange(category: string | null): void {
    if (category === 'all') {
      this.clearFilters();
    } else if (category) {
      this.filterByCategory(category);
    }
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

  private addStructuredData(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Remove existing structured data script if present
    const existingScript = document.getElementById('blog-structured-data');
    if (existingScript) {
      existingScript.remove();
    }

    // Create Blog + ItemList structured data
    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Blog',
          '@id': 'https://www.allthethings.dev/blog',
          'url': 'https://www.allthethings.dev/blog',
          'name': 'All The Things Blog — Web Development, Tools, and Tutorials',
          'headline': 'All The Things Blog — Web Development, Tools, and Tutorials',
          'description': 'Explore blog posts on web development, coding tips, tool tutorials, and practical guides for developers and creators.',
          'inLanguage': 'en-US',
          'publisher': {
            '@type': 'Organization',
            'name': 'All The Things',
            'url': 'https://www.allthethings.dev'
          }
        },
        {
          '@type': 'ItemList',
          'name': 'Blog Posts',
          'description': 'Latest blog articles and tutorials',
          'numberOfItems': this.articles.length,
          'itemListElement': this.articles.map((article, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'url': `https://www.allthethings.dev/blog/${article.slug}`,
            'name': article.title,
            'datePublished': new Date(article.publishedDate).toISOString()
          }))
        }
      ]
    };

    const script = document.createElement('script');
    script.id = 'blog-structured-data';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }
}
