import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { map, delay, switchMap } from 'rxjs/operators';
import {
  Article,
  ArticlePreview,
  PaginatedResponse,
  BlogConfig,
  ContentBlock,
} from '../models/blog.models';
import { BLOG_ARTICLES_METADATA, ArticleMetadata } from '../data/articles-metadata.data';
import { loadArticleContent } from '../data/content/article-content-loader';

/**
 * BlogService
 * Manages blog articles, pagination, and article retrieval
 * For static prerendered sites - uses client-side pagination
 */
@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private readonly config: BlogConfig = {
    pageSize: 10,
    baseUrl: 'https://www.allthethings.dev/blog',
    defaultOgImage: 'https://www.allthethings.dev/meta-images/og-blog.png',
  };

  // Cache for article metadata and previews
  private metadataCache = signal<ArticleMetadata[]>(BLOG_ARTICLES_METADATA);
  private previewsCache = signal<ArticlePreview[]>([]);
  private fullArticlesCache = new Map<string, Article>(); // Cache loaded articles

  constructor() {
    this.initializePreviewCache();
  }

  /**
   * Initialize article preview cache
   */
  private initializePreviewCache(): void {
    const previews = this.metadataCache().map((metadata) =>
      this.convertMetadataToPreview(metadata)
    );
    this.previewsCache.set(previews);
  }

  /**
   * Get paginated article previews
   */
  getArticlePreviews(
    page: number = 1,
    pageSize: number = this.config.pageSize,
    filters?: {
      category?: string;
      tag?: string;
      featured?: boolean;
    }
  ): Observable<PaginatedResponse<ArticlePreview>> {
    let previews = this.previewsCache();

    // Apply filters
    if (filters?.category) {
      previews = previews.filter((p) => p.category === filters.category);
    }
    if (filters?.tag) {
      previews = previews.filter((p) => p.tags.includes(filters.tag!));
    }
    if (filters?.featured !== undefined) {
      previews = previews.filter((p) => p.featured === filters.featured);
    }

    // Sort by date (newest first)
    previews = [...previews].sort((a, b) => {
      const dateA = new Date(a.publishedDate).getTime();
      const dateB = new Date(b.publishedDate).getTime();
      return dateB - dateA;
    });

    // Calculate pagination
    const totalItems = previews.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = previews.slice(startIndex, endIndex);

    return of({
      items,
      currentPage: page,
      pageSize,
      totalItems,
      totalPages,
    }).pipe(delay(100)); // Simulate small network delay
  }

  /**
   * Get article by slug (loads content dynamically)
   */
  getArticleBySlug(slug: string): Observable<Article | null> {
    // Check if article is already fully loaded in cache
    if (this.fullArticlesCache.has(slug)) {
      return of(this.fullArticlesCache.get(slug)!).pipe(delay(50));
    }

    // Find metadata
    const metadata = this.metadataCache().find((m) => m.slug === slug);
    if (!metadata) {
      return of(null);
    }

    // Load content and merge with metadata
    return from(loadArticleContent(slug)).pipe(
      map((content) => {
        if (!content) {
          return null;
        }

        const article: Article = {
          ...metadata,
          content,
        };

        // Cache the full article
        this.fullArticlesCache.set(slug, article);
        return article;
      }),
      delay(50)
    );
  }

  /**
   * Get article by ID (loads content dynamically)
   */
  getArticleById(id: string): Observable<Article | null> {
    const metadata = this.metadataCache().find((m) => m.id === id);
    if (!metadata) {
      return of(null);
    }

    // Use getArticleBySlug to leverage caching and content loading
    return this.getArticleBySlug(metadata.slug);
  }

  /**
   * Get related articles
   */
  getRelatedArticles(
    article: Article,
    limit: number = 3
  ): Observable<ArticlePreview[]> {
    let related: ArticlePreview[] = [];

    // First, try to get explicitly related articles
    if (article.relatedArticles && article.relatedArticles.length > 0) {
      const relatedById = this.previewsCache().filter((p) =>
        article.relatedArticles!.includes(p.id)
      );
      related = [...relatedById];
    }

    // If not enough, find articles with matching tags
    if (related.length < limit) {
      const byTags = this.previewsCache()
        .filter((p) => p.id !== article.id)
        .filter((p) => p.tags.some((tag) => article.tags.includes(tag)))
        .slice(0, limit - related.length);
      related = [...related, ...byTags];
    }

    // If still not enough, get from same category
    if (related.length < limit) {
      const byCategory = this.previewsCache()
        .filter((p) => p.id !== article.id)
        .filter((p) => p.category === article.category)
        .filter((p) => !related.find((r) => r.id === p.id))
        .slice(0, limit - related.length);
      related = [...related, ...byCategory];
    }

    return of(related.slice(0, limit)).pipe(delay(50));
  }

  /**
   * Get all categories
   */
  getCategories(): Observable<string[]> {
    const categories = [
      ...new Set(this.metadataCache().map((m) => m.category)),
    ];
    return of(categories.sort());
  }

  /**
   * Get all tags
   */
  getTags(): Observable<string[]> {
    const tags = new Set<string>();
    this.metadataCache().forEach((metadata) => {
      metadata.tags.forEach((tag) => tags.add(tag));
    });
    return of([...tags].sort());
  }

  /**
   * Get featured articles
   */
  getFeaturedArticles(limit: number = 3): Observable<ArticlePreview[]> {
    const featured = this.previewsCache()
      .filter((p) => p.featured)
      .slice(0, limit);
    return of(featured).pipe(delay(50));
  }

  /**
   * Get recent articles
   */
  getRecentArticles(limit: number = 5): Observable<ArticlePreview[]> {
    const recent = [...this.previewsCache()]
      .sort((a, b) => {
        const dateA = new Date(a.publishedDate).getTime();
        const dateB = new Date(b.publishedDate).getTime();
        return dateB - dateA;
      })
      .slice(0, limit);
    return of(recent).pipe(delay(50));
  }

  /**
   * Calculate reading time for article content
   */
  calculateReadingTime(article: Article): number {
    const wordsPerMinute = 200;
    let totalWords = 0;

    // Count words in title and description
    totalWords += article.title.split(/\s+/).length;
    totalWords += article.description.split(/\s+/).length;

    // Count words in content blocks
    article.content.forEach((block) => {
      switch (block.type) {
        case 'paragraph':
          totalWords += block.data.text.split(/\s+/).length;
          break;
        case 'heading':
          totalWords += block.data.text.split(/\s+/).length;
          break;
        case 'blockquote':
          totalWords += block.data.text.split(/\s+/).length;
          break;
        case 'list':
          block.data.items.forEach((item: string) => {
            totalWords += item.split(/\s+/).length;
          });
          break;
        case 'cta':
          totalWords += block.data.title.split(/\s+/).length;
          totalWords += block.data.description.split(/\s+/).length;
          break;
      }
    });

    return Math.ceil(totalWords / wordsPerMinute);
  }

  /**
   * Convert ArticleMetadata to ArticlePreview
   */
  private convertMetadataToPreview(metadata: ArticleMetadata): ArticlePreview {
    return {
      id: metadata.id,
      slug: metadata.slug,
      title: metadata.title,
      description: metadata.description,
      author: metadata.author,
      publishedDate: metadata.publishedDate,
      heroImage: metadata.heroImage,
      tags: metadata.tags,
      category: metadata.category,
      readingTime: this.estimateReadingTime(metadata),
      featured: metadata.featured,
    };
  }

  /**
   * Estimate reading time from metadata (without content)
   * Uses a rough estimation based on title and description
   */
  private estimateReadingTime(metadata: ArticleMetadata): number {
    const wordsPerMinute = 200;
    let totalWords = 0;

    totalWords += metadata.title.split(/\s+/).length;
    totalWords += metadata.description.split(/\s+/).length;

    // Estimate content words based on article category
    // This is a rough estimate since we don't have actual content
    const estimatedContentWords = 800; // Average article length
    totalWords += estimatedContentWords;

    return Math.ceil(totalWords / wordsPerMinute);
  }

  /**
   * Get blog configuration
   */
  getConfig(): BlogConfig {
    return { ...this.config };
  }

  /**
   * Build article URL
   */
  getArticleUrl(slug: string): string {
    return `${this.config.baseUrl}/${slug}`;
  }

  /**
   * Build paginated listing URL
   */
  getListingUrl(page: number = 1): string {
    return page === 1
      ? this.config.baseUrl
      : `${this.config.baseUrl}?page=${page}`;
  }
}
