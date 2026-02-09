import { Injectable, signal } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { map } from 'rxjs/operators';
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
    pageSize: 9,
    baseUrl: 'https://www.allthethings.dev/blog',
    defaultOgImage: 'https://www.allthethings.dev/meta-images/og-blog.png',
  };

  // Cache for article metadata and previews
  private metadataCache = signal<ArticleMetadata[]>(BLOG_ARTICLES_METADATA);
  private fullArticlesCache = new Map<string, Article>(); // Cache loaded articles

  constructor() {
    // No initialization needed - metadata is already loaded from constant
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
    // Use metadata with estimated reading times
    let previews: ArticlePreview[] = this.metadataCache().map(metadata => ({
      ...metadata,
      readingTime: this.estimateReadingTime(metadata),
    }));

    // Filter out non-displayed articles (display defaults to true if not specified)
    previews = previews.filter((p) => p.display !== false);

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
    });
  }

  /**
   * Get article by slug (loads content dynamically)
   */
  getArticleBySlug(slug: string): Observable<Article | null> {
    // Check if article is already fully loaded in cache
    if (this.fullArticlesCache.has(slug)) {
      return of(this.fullArticlesCache.get(slug)!);
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
      })
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

    // Use metadata with estimated reading times
    const previews: ArticlePreview[] = this.metadataCache().map(metadata => ({
      ...metadata,
      readingTime: this.estimateReadingTime(metadata),
    }));

    const displayedPreviews = previews.filter((p) => p.display !== false);

    // First, try to get explicitly related articles
    if (article.relatedArticles && article.relatedArticles.length > 0) {
      const relatedById = displayedPreviews.filter((p) =>
        article.relatedArticles!.includes(p.id)
      );
      related = [...relatedById];
    }

    // If not enough, find articles with matching tags
    if (related.length < limit) {
      const byTags = displayedPreviews
        .filter((p) => p.id !== article.id)
        .filter((p) => p.tags.some((tag) => article.tags.includes(tag)))
        .slice(0, limit - related.length);
      related = [...related, ...byTags];
    }

    // If still not enough, get from same category
    if (related.length < limit) {
      const byCategory = displayedPreviews
        .filter((p) => p.id !== article.id)
        .filter((p) => p.category === article.category)
        .filter((p) => !related.find((r) => r.id === p.id))
        .slice(0, limit - related.length);
      related = [...related, ...byCategory];
    }

    return of(related.slice(0, limit));
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
    // Use metadata with estimated reading times
    const previews: ArticlePreview[] = this.metadataCache().map(metadata => ({
      ...metadata,
      readingTime: this.estimateReadingTime(metadata),
    }));

    const featured = previews
      .filter((p) => p.display !== false)
      .filter((p) => p.featured)
      .slice(0, limit);
    return of(featured);
  }

  /**
   * Get recent articles
   */
  getRecentArticles(limit: number = 5): Observable<ArticlePreview[]> {
    // Use metadata with estimated reading times
    const previews: ArticlePreview[] = this.metadataCache().map(metadata => ({
      ...metadata,
      readingTime: this.estimateReadingTime(metadata),
    }));

    const recent = [...previews]
      .filter((p) => p.display !== false)
      .sort((a, b) => {
        const dateA = new Date(a.publishedDate).getTime();
        const dateB = new Date(b.publishedDate).getTime();
        return dateB - dateA;
      })
      .slice(0, limit);
    return of(recent);
  }

  /**
   * Get all articles (for cross-linking and content matching)
   */
  getAllArticles(): Observable<ArticlePreview[]> {
    // Use metadata with estimated reading times
    const previews: ArticlePreview[] = this.metadataCache().map(metadata => ({
      ...metadata,
      readingTime: this.estimateReadingTime(metadata),
    }));

    // Return all displayed articles
    return of(previews.filter((p) => p.display !== false));
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
   * Estimate reading time from metadata (without content)
   * Uses the readTime from metadata if available, otherwise estimates
   */
  private estimateReadingTime(metadata: ArticleMetadata): number {
    // If readTime is already calculated and stored in metadata, use it
    if (metadata.readTime && metadata.readTime > 0) {
      return metadata.readTime;
    }

    // Otherwise, fall back to estimation
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
