import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin, shareReplay } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import {
  Resource,
  ResourcePreview,
  PaginatedResponse,
  ResourcesConfig,
  ResourceFilters,
} from '../models/resource.models';
import { environment } from '../../../../environments/environment';

/**
 * ResourcesService
 *
 * resources.json  — lightweight index (IDs only, ordered newest-first)
 * {slug}.json     — full resource data, fetched on demand per page or detail view
 *
 * Flow:
 *  1. Fetch resources.json once → ordered list of slugs (cached)
 *  2. For each listing page: slice the relevant slugs, fetch only those JSONs in parallel
 *  3. Detail page / click: fetch (or return cached) individual {slug}.json
 */
@Injectable({
  providedIn: 'root',
})
export class ResourcesService {
  private http = inject(HttpClient);

  private readonly config: ResourcesConfig = {
    pageSize: 9,
    baseUrl: 'https://www.allthethings.dev/resources',
    defaultOgImage: 'https://www.allthethings.dev/meta-images/og-resources.png',
  };

  private readonly apiUrl = environment.resourcesUrl;

  // Ordered slug list from resources.json
  private indexSlugs: string[] | null = null;
  private indexFetch$: Observable<string[]> | null = null;

  // Per-resource cache and in-flight dedup
  private resourceCache = new Map<string, Resource>();
  private resourceFetches = new Map<string, Observable<Resource | null>>();

  // ── Index ────────────────────────────────────────────────────────────────

  private fetchIndex(): Observable<string[]> {
    if (this.indexSlugs) return of(this.indexSlugs);
    if (!this.indexFetch$) {
      this.indexFetch$ = this.http
        .get<{ resources: { id: string }[] }>(`${this.apiUrl}/resources.json`)
        .pipe(
          map((response) => {
            const slugs = response.resources.map((r) => r.id);
            this.indexSlugs = slugs;
            return slugs;
          }),
          shareReplay(1)
        );
    }
    return this.indexFetch$;
  }

  // ── Individual resource ──────────────────────────────────────────────────

  private fetchResource(slug: string): Observable<Resource | null> {
    if (this.resourceCache.has(slug)) {
      return of(this.resourceCache.get(slug)!);
    }
    if (!this.resourceFetches.has(slug)) {
      this.resourceFetches.set(
        slug,
        this.http.get<Resource>(`${this.apiUrl}/${slug}.json`).pipe(
          tap((r) => this.resourceCache.set(slug, r)),
          catchError(() => of(null)),
          shareReplay(1)
        )
      );
    }
    return this.resourceFetches.get(slug)!;
  }

  // ── Public API ───────────────────────────────────────────────────────────

  /**
   * Get paginated resource previews.
   *
   * Without filters: only fetches the current page's individual JSONs.
   * With filters:    fetches all JSONs (needed to evaluate filter conditions),
   *                  then filters and paginates in memory.
   */
  getResourcePreviews(
    page: number = 1,
    pageSize: number = this.config.pageSize,
    filters?: ResourceFilters
  ): Observable<PaginatedResponse<ResourcePreview>> {
    return this.fetchIndex().pipe(
      switchMap((slugs) => {
        const hasFilters = !!(
          filters?.category ||
          filters?.tag ||
          filters?.search ||
          filters?.featured !== undefined ||
          filters?.isPaid !== undefined ||
          filters?.difficulty
        );

        // Determine which slugs to fetch
        const slugsToFetch = hasFilters
          ? slugs                                              // all (to filter)
          : slugs.slice((page - 1) * pageSize, page * pageSize); // current page only

        if (slugsToFetch.length === 0) {
          return of({
            items: [] as ResourcePreview[],
            currentPage: page,
            pageSize,
            totalItems: slugs.length,
            totalPages: Math.ceil(slugs.length / pageSize),
          });
        }

        return forkJoin(slugsToFetch.map((s) => this.fetchResource(s))).pipe(
          map((resources) => {
            let items = resources.filter(Boolean) as Resource[];

            if (filters?.category) {
              items = items.filter((r) => r.category === filters.category);
            }
            if (filters?.tag) {
              items = items.filter((r) => r.tags.includes(filters.tag!));
            }
            if (filters?.featured !== undefined) {
              items = items.filter((r) => r.featured === filters.featured);
            }
            if (filters?.isPaid !== undefined) {
              items = items.filter((r) => r.isPaid === filters.isPaid);
            }
            if (filters?.difficulty) {
              items = items.filter((r) => r.difficulty === filters.difficulty);
            }
            if (filters?.search) {
              const q = filters.search.toLowerCase();
              items = items.filter(
                (r) =>
                  r.title.toLowerCase().includes(q) ||
                  r.description.toLowerCase().includes(q) ||
                  r.subtitle.toLowerCase().includes(q) ||
                  r.tags.some((t) => t.toLowerCase().includes(q))
              );
            }

            const totalItems = hasFilters ? items.length : slugs.length;
            const totalPages = Math.ceil(totalItems / pageSize);
            const pageItems = hasFilters
              ? items.slice((page - 1) * pageSize, page * pageSize)
              : items; // already sliced via slugsToFetch

            return {
              items: pageItems as unknown as ResourcePreview[],
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
   * Fetch a single resource by slug.
   * Returns cached data immediately if already loaded.
   */
  getResourceBySlug(slug: string): Observable<Resource | null> {
    return this.fetchResource(slug);
  }

  getResourceById(id: string): Observable<Resource | null> {
    return this.getResourceBySlug(id);
  }

  /**
   * Get related resources. Uses relatedResources slugs from the individual JSON,
   * falling back to tag/category matches from already-cached resources.
   */
  getRelatedResources(
    resource: Resource,
    limit: number = 3
  ): Observable<ResourcePreview[]> {
    return this.fetchIndex().pipe(
      switchMap((slugs) => {
        let relatedSlugs: string[] = [];

        if (resource.relatedResources?.length) {
          relatedSlugs = resource.relatedResources.filter((s) =>
            slugs.includes(s)
          );
        }

        // Fill remaining slots from cached resources with matching tags/category
        if (relatedSlugs.length < limit) {
          const extra = slugs
            .filter((s) => s !== resource.slug && !relatedSlugs.includes(s))
            .filter((s) => this.resourceCache.has(s))
            .map((s) => this.resourceCache.get(s)!)
            .filter(
              (r) =>
                r.tags.some((t) => resource.tags.includes(t)) ||
                r.category === resource.category
            )
            .map((r) => r.slug)
            .slice(0, limit - relatedSlugs.length);
          relatedSlugs = [...relatedSlugs, ...extra];
        }

        if (relatedSlugs.length === 0) return of([]);

        return forkJoin(
          relatedSlugs.slice(0, limit).map((s) => this.fetchResource(s))
        ).pipe(
          map((resources) => resources.filter(Boolean) as unknown as ResourcePreview[])
        );
      })
    );
  }

  getCategories(): Observable<string[]> {
    const cached = [...this.resourceCache.values()];
    return of([...new Set(cached.map((r) => r.category))].sort());
  }

  getTags(): Observable<string[]> {
    const tags = new Set<string>();
    this.resourceCache.forEach((r) => r.tags.forEach((t) => tags.add(t)));
    return of([...tags].sort());
  }

  getFeaturedResources(limit: number = 3): Observable<ResourcePreview[]> {
    return this.fetchIndex().pipe(
      switchMap((slugs) =>
        forkJoin(slugs.slice(0, limit * 3).map((s) => this.fetchResource(s))).pipe(
          map((resources) =>
            (resources.filter(Boolean) as Resource[])
              .filter((r) => r.featured)
              .slice(0, limit) as unknown as ResourcePreview[]
          )
        )
      )
    );
  }

  getRecentResources(limit: number = 5): Observable<ResourcePreview[]> {
    return this.fetchIndex().pipe(
      switchMap((slugs) =>
        forkJoin(slugs.slice(0, limit).map((s) => this.fetchResource(s))).pipe(
          map((resources) => resources.filter(Boolean) as unknown as ResourcePreview[])
        )
      )
    );
  }

  getAllResources(): Observable<ResourcePreview[]> {
    return this.fetchIndex().pipe(
      switchMap((slugs) => {
        if (!slugs.length) return of([]);
        return forkJoin(slugs.map((s) => this.fetchResource(s))).pipe(
          map((resources) => resources.filter(Boolean) as unknown as ResourcePreview[])
        );
      })
    );
  }

  getConfig(): ResourcesConfig {
    return { ...this.config };
  }

  getResourceUrl(resource: Resource): string {
    return resource.externalUrl;
  }

  getResourcePageUrl(slug: string): string {
    return `${this.config.baseUrl}/${slug}`;
  }

  getListingUrl(page: number = 1): string {
    return page === 1
      ? this.config.baseUrl
      : `${this.config.baseUrl}?page=${page}`;
  }
}
