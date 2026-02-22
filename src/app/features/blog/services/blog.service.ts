import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin, shareReplay, timer } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import {
  Article,
  ArticlePreview,
  PaginatedResponse,
  BlogConfig,
  ContentBlock,
} from '../models/blog.models';
import { environment } from '../../../../environments/environment';

/**
 * BlogService
 *
 * blog.json           — lightweight index (slugs only, ordered newest-first)
 * previews/{slug}.json — lightweight preview for listing cards
 * articles/{slug}.json — full article data including content blocks
 *
 * Flow:
 *  1. Fetch blog.json once → ordered list of slugs (cached)
 *  2. Listing page (no filters): slice relevant slugs, forkJoin only those previews
 *  3. Listing page (with filters): fetch all previews, filter, paginate
 *  4. Detail page: fetch (or return cached) articles/{slug}.json
 */
@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private http = inject(HttpClient);

  private readonly config: BlogConfig = {
    pageSize: 9,
    baseUrl: 'https://www.allthethings.dev/blog',
    defaultOgImage: 'https://www.allthethings.dev/meta-images/og-blog.png',
  };

  private readonly apiUrl = environment.blogUrl;

  // Ordered slug list from blog.json
  private indexSlugs: string[] | null = null;
  private indexFetch$: Observable<string[]> | null = null;

  // Preview cache (listing only — no content, metaDescription, etc.)
  private previewCache = new Map<string, ArticlePreview>();
  private previewFetches = new Map<string, Observable<ArticlePreview | null>>();

  // Full article cache (detail page)
  private articleCache = new Map<string, Article>();
  private articleFetches = new Map<string, Observable<Article | null>>();

  // ── Index ────────────────────────────────────────────────────────────────

  private fetchIndex(): Observable<string[]> {
    if (this.indexSlugs) return of(this.indexSlugs);
    if (!this.indexFetch$) {
      this.indexFetch$ = timer(250).pipe(
        switchMap(() => this.http.get<{ articles: { id: string }[] }>(`${this.apiUrl}/blog.json`)),
        map((response) => {
          const slugs = response.articles.map((a) => a.id);
          this.indexSlugs = slugs;
          return slugs;
        }),
        shareReplay(1)
      );
    }
    return this.indexFetch$;
  }

  // ── Preview (listing) ────────────────────────────────────────────────────

  private fetchPreview(slug: string): Observable<ArticlePreview | null> {
    if (this.previewCache.has(slug)) {
      return of(this.previewCache.get(slug)!);
    }
    if (!this.previewFetches.has(slug)) {
      this.previewFetches.set(
        slug,
        this.http.get<ArticlePreview>(`${this.apiUrl}/previews/${slug}.json`).pipe(
          tap((a) => this.previewCache.set(slug, a)),
          catchError(() => of(null)),
          shareReplay(1)
        )
      );
    }
    return this.previewFetches.get(slug)!;
  }

  // ── Full article (detail page) ───────────────────────────────────────────

  private fetchArticle(slug: string): Observable<Article | null> {
    if (this.articleCache.has(slug)) {
      return of(this.articleCache.get(slug)!);
    }
    if (!this.articleFetches.has(slug)) {
      this.articleFetches.set(
        slug,
        this.http.get<Article>(`${this.apiUrl}/articles/${slug}.json`).pipe(
          tap((a) => this.articleCache.set(slug, a)),
          catchError(() => of(null)),
          shareReplay(1)
        )
      );
    }
    return this.articleFetches.get(slug)!;
  }

  // ── Public API ───────────────────────────────────────────────────────────

  /**
   * Get paginated article previews.
   *
   * Without filters: only fetches the current page's individual previews.
   * With filters:    fetches all previews (needed to evaluate filter conditions),
   *                  then filters and paginates in memory.
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
    return this.fetchIndex().pipe(
      switchMap((slugs) => {
        const hasFilters = !!(
          filters?.category ||
          filters?.tag ||
          filters?.featured !== undefined
        );

        const slugsToFetch = hasFilters
          ? slugs
          : slugs.slice((page - 1) * pageSize, page * pageSize);

        if (slugsToFetch.length === 0) {
          return of({
            items: [] as ArticlePreview[],
            currentPage: page,
            pageSize,
            totalItems: slugs.length,
            totalPages: Math.ceil(slugs.length / pageSize),
          });
        }

        return forkJoin(slugsToFetch.map((s) => this.fetchPreview(s))).pipe(
          map((previews) => {
            let items = previews.filter(Boolean) as ArticlePreview[];

            // Filter out non-displayed articles
            items = items.filter((p) => p.display !== false);

            if (filters?.category) {
              items = items.filter((p) => p.category === filters.category);
            }
            if (filters?.tag) {
              items = items.filter((p) => p.tags.includes(filters.tag!));
            }
            if (filters?.featured !== undefined) {
              items = items.filter((p) => p.featured === filters.featured);
            }

            const totalItems = hasFilters ? items.length : slugs.length;
            const totalPages = Math.ceil(totalItems / pageSize);
            const pageItems = hasFilters
              ? items.slice((page - 1) * pageSize, page * pageSize)
              : items;

            return {
              items: pageItems,
              currentPage: page,
              pageSize,
              totalItems,
              totalPages,
            };
          })
        );
      })
    );
  }

  /**
   * Fetch a single article by slug (full data including content).
   */
  getArticleBySlug(slug: string): Observable<Article | null> {
    return this.fetchArticle(slug);
  }

  /**
   * Fetch a single article by ID.
   * In the JSON architecture id = slug, so this delegates to getArticleBySlug.
   */
  getArticleById(id: string): Observable<Article | null> {
    return this.getArticleBySlug(id);
  }

  /**
   * Get related articles for a given article.
   * Uses relatedArticles slugs from the full JSON, falling back to
   * tag/category matches from already-cached previews.
   */
  getRelatedArticles(
    article: Article,
    limit: number = 3
  ): Observable<ArticlePreview[]> {
    return this.fetchIndex().pipe(
      switchMap((slugs) => {
        let relatedSlugs: string[] = [];

        if (article.relatedArticles?.length) {
          relatedSlugs = article.relatedArticles.filter((s) =>
            slugs.includes(s)
          );
        }

        // Fill remaining slots from cached previews with matching tags/category
        if (relatedSlugs.length < limit) {
          const extra = slugs
            .filter((s) => s !== article.slug && !relatedSlugs.includes(s))
            .filter((s) => this.previewCache.has(s))
            .map((s) => this.previewCache.get(s)!)
            .filter(
              (p) =>
                p.tags.some((t) => article.tags.includes(t)) ||
                p.category === article.category
            )
            .map((p) => p.slug)
            .slice(0, limit - relatedSlugs.length);
          relatedSlugs = [...relatedSlugs, ...extra];
        }

        if (relatedSlugs.length === 0) return of([]);

        return forkJoin(
          relatedSlugs.slice(0, limit).map((s) => this.fetchPreview(s))
        ).pipe(
          map((previews) => previews.filter(Boolean) as ArticlePreview[])
        );
      })
    );
  }

  /**
   * Get all categories (from cached previews).
   */
  getCategories(): Observable<string[]> {
    const cached = [...this.previewCache.values()];
    return of([...new Set(cached.map((p) => p.category))].sort());
  }

  /**
   * Get all tags (from cached previews).
   */
  getTags(): Observable<string[]> {
    const tags = new Set<string>();
    this.previewCache.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return of([...tags].sort());
  }

  /**
   * Get featured articles.
   */
  getFeaturedArticles(limit: number = 3): Observable<ArticlePreview[]> {
    return this.fetchIndex().pipe(
      switchMap((slugs) =>
        forkJoin(slugs.slice(0, limit * 3).map((s) => this.fetchPreview(s))).pipe(
          map((previews) =>
            (previews.filter(Boolean) as ArticlePreview[])
              .filter((p) => p.featured)
              .slice(0, limit)
          )
        )
      )
    );
  }

  /**
   * Get recent articles (first N from index, already ordered newest-first).
   */
  getRecentArticles(limit: number = 5): Observable<ArticlePreview[]> {
    return this.fetchIndex().pipe(
      switchMap((slugs) =>
        forkJoin(slugs.slice(0, limit).map((s) => this.fetchPreview(s))).pipe(
          map((previews) => previews.filter(Boolean) as ArticlePreview[])
        )
      )
    );
  }

  /**
   * Get all articles (for cross-linking and content matching).
   */
  getAllArticles(): Observable<ArticlePreview[]> {
    return this.fetchIndex().pipe(
      switchMap((slugs) => {
        if (!slugs.length) return of([]);
        return forkJoin(slugs.map((s) => this.fetchPreview(s))).pipe(
          map((previews) =>
            (previews.filter(Boolean) as ArticlePreview[]).filter(
              (p) => p.display !== false
            )
          )
        );
      })
    );
  }

  /**
   * Calculate reading time for a fully loaded article.
   */
  calculateReadingTime(article: Article): number {
    const wordsPerMinute = 200;
    let totalWords = 0;

    totalWords += article.title.split(/\s+/).length;
    totalWords += article.description.split(/\s+/).length;

    article.content.forEach((block: ContentBlock) => {
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
   * Get blog configuration.
   */
  getConfig(): BlogConfig {
    return { ...this.config };
  }

  /**
   * Build article URL.
   */
  getArticleUrl(slug: string): string {
    return `${this.config.baseUrl}/${slug}`;
  }

  /**
   * Build paginated listing URL.
   */
  getListingUrl(page: number = 1): string {
    return page === 1
      ? this.config.baseUrl
      : `${this.config.baseUrl}?page=${page}`;
  }
}
