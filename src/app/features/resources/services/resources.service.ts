import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, shareReplay } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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
 * Fetches resources from json.allthethings.dev/resources/.
 * resources.json is fetched once and cached for listing/search.
 * Individual {slug}.json files are fetched on demand for detail pages.
 */
@Injectable({
  providedIn: 'root',
})
export class ResourcesService {
  private http = inject(HttpClient);

  private readonly config: ResourcesConfig = {
    pageSize: 21,
    baseUrl: 'https://www.allthethings.dev/resources',
    defaultOgImage: 'https://www.allthethings.dev/meta-images/og-resources.png',
  };

  private readonly apiUrl = environment.resourcesUrl;

  // In-memory cache for the index
  private indexCache: ResourcePreview[] | null = null;
  // Shared in-flight observable — prevents duplicate HTTP requests when
  // the listing fires two calls simultaneously (search autocomplete + page load)
  private indexFetch$: Observable<ResourcePreview[]> | null = null;

  private fetchIndex(): Observable<ResourcePreview[]> {
    if (this.indexCache) {
      return of(this.indexCache);
    }
    if (!this.indexFetch$) {
      this.indexFetch$ = this.http
        .get<{ resources: ResourcePreview[] }>(`${this.apiUrl}/resources.json`)
        .pipe(
          map((response) => {
            const previews = response.resources.filter((r) => r.display !== false);
            this.indexCache = previews;
            return previews;
          }),
          shareReplay(1)
        );
    }
    return this.indexFetch$;
  }

  /**
   * Get paginated resource previews.
   * Fetches resources.json once, then paginates client-side from cache.
   */
  getResourcePreviews(
    page: number = 1,
    pageSize: number = this.config.pageSize,
    filters?: ResourceFilters
  ): Observable<PaginatedResponse<ResourcePreview>> {
    return this.fetchIndex().pipe(
      map((previews) => {
        let filtered = previews;

        if (filters?.category) {
          filtered = filtered.filter((p) => p.category === filters.category);
        }
        if (filters?.tag) {
          filtered = filtered.filter((p) => p.tags.includes(filters.tag!));
        }
        if (filters?.featured !== undefined) {
          filtered = filtered.filter((p) => p.featured === filters.featured);
        }
        if (filters?.isPaid !== undefined) {
          filtered = filtered.filter((p) => p.isPaid === filters.isPaid);
        }
        if (filters?.difficulty) {
          filtered = filtered.filter((p) => p.difficulty === filters.difficulty);
        }
        if (filters?.search) {
          const searchLower = filters.search.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.title.toLowerCase().includes(searchLower) ||
              p.description.toLowerCase().includes(searchLower) ||
              p.subtitle.toLowerCase().includes(searchLower) ||
              p.tags.some((tag) => tag.toLowerCase().includes(searchLower))
          );
        }

        // Sort newest first (resources.json is pre-sorted, but respect filters)
        filtered = [...filtered].sort((a, b) => {
          const dateA = new Date(a.publishedDate).getTime();
          const dateB = new Date(b.publishedDate).getTime();
          return dateB - dateA;
        });

        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / pageSize);
        const startIndex = (page - 1) * pageSize;
        const items = filtered.slice(startIndex, startIndex + pageSize);

        return { items, currentPage: page, pageSize, totalItems, totalPages };
      })
    );
  }

  /**
   * Get full resource data by slug.
   * Fetches the individual {slug}.json from the API.
   */
  getResourceBySlug(slug: string): Observable<Resource | null> {
    return this.http
      .get<Resource>(`${this.apiUrl}/${slug}.json`)
      .pipe(catchError(() => of(null)));
  }

  /**
   * Get resource by ID (id === slug in the new JSON schema).
   */
  getResourceById(id: string): Observable<Resource | null> {
    return this.getResourceBySlug(id);
  }

  /**
   * Get related resources for a given resource.
   * relatedResources in individual JSONs are slugs.
   */
  getRelatedResources(
    resource: Resource,
    limit: number = 3
  ): Observable<ResourcePreview[]> {
    return this.fetchIndex().pipe(
      map((previews) => {
        let related: ResourcePreview[] = [];

        // Match by slug (relatedResources are slugs in new schema)
        if (resource.relatedResources && resource.relatedResources.length > 0) {
          related = resource.relatedResources
            .map((slug) => previews.find((p) => p.slug === slug))
            .filter(Boolean) as ResourcePreview[];
        }

        // Fall back to matching tags
        if (related.length < limit) {
          const byTags = previews
            .filter((p) => p.slug !== resource.slug)
            .filter((p) => !related.find((r) => r.slug === p.slug))
            .filter((p) => p.tags.some((tag) => resource.tags.includes(tag)))
            .slice(0, limit - related.length);
          related = [...related, ...byTags];
        }

        // Fall back to same category
        if (related.length < limit) {
          const byCategory = previews
            .filter((p) => p.slug !== resource.slug)
            .filter((p) => p.category === resource.category)
            .filter((p) => !related.find((r) => r.slug === p.slug))
            .slice(0, limit - related.length);
          related = [...related, ...byCategory];
        }

        return related.slice(0, limit);
      })
    );
  }

  /**
   * Get all unique categories from the index.
   */
  getCategories(): Observable<string[]> {
    return this.fetchIndex().pipe(
      map((previews) => {
        const categories = [...new Set(previews.map((r) => r.category))];
        return categories.sort();
      })
    );
  }

  /**
   * Get all unique tags from the index.
   */
  getTags(): Observable<string[]> {
    return this.fetchIndex().pipe(
      map((previews) => {
        const tags = new Set<string>();
        previews.forEach((r) => r.tags.forEach((tag) => tags.add(tag)));
        return [...tags].sort();
      })
    );
  }

  /**
   * Get featured resources from the index.
   */
  getFeaturedResources(limit: number = 3): Observable<ResourcePreview[]> {
    return this.fetchIndex().pipe(
      map((previews) => previews.filter((p) => p.featured).slice(0, limit))
    );
  }

  /**
   * Get most recent resources from the index.
   */
  getRecentResources(limit: number = 5): Observable<ResourcePreview[]> {
    return this.fetchIndex().pipe(
      map((previews) =>
        [...previews]
          .sort((a, b) => {
            const dateA = new Date(a.publishedDate).getTime();
            const dateB = new Date(b.publishedDate).getTime();
            return dateB - dateA;
          })
          .slice(0, limit)
      )
    );
  }

  /**
   * Get all displayed resources from the index.
   */
  getAllResources(): Observable<ResourcePreview[]> {
    return this.fetchIndex();
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
