import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  Resource,
  ResourcePreview,
  PaginatedResponse,
  ResourcesConfig,
  ResourceFilters,
} from '../models/resource.models';
import { RESOURCES_METADATA } from '../data/resources-metadata.data';

/**
 * ResourcesService
 * Manages resources, pagination, and resource retrieval
 * For static prerendered sites - uses client-side pagination
 */
@Injectable({
  providedIn: 'root',
})
export class ResourcesService {
  private readonly config: ResourcesConfig = {
    pageSize: 21,
    baseUrl: 'https://www.allthethings.dev/resources',
    defaultOgImage: 'https://www.allthethings.dev/meta-images/og-resources.png',
  };

  // Cache for resource metadata and previews
  private metadataCache = signal<Resource[]>(RESOURCES_METADATA);
  private previewsCache = signal<ResourcePreview[]>([]);

  constructor() {
    this.initializePreviewCache();
  }

  /**
   * Initialize resource preview cache
   */
  private initializePreviewCache(): void {
    const previews = this.metadataCache().map((metadata) =>
      this.convertMetadataToPreview(metadata)
    );
    this.previewsCache.set(previews);
  }

  /**
   * Get paginated resource previews
   */
  getResourcePreviews(
    page: number = 1,
    pageSize: number = this.config.pageSize,
    filters?: ResourceFilters
  ): Observable<PaginatedResponse<ResourcePreview>> {
    let previews = this.previewsCache();

    // Filter out non-displayed resources (display defaults to true if not specified)
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
    if (filters?.isPaid !== undefined) {
      previews = previews.filter((p) => p.isPaid === filters.isPaid);
    }
    if (filters?.difficulty) {
      previews = previews.filter((p) => p.difficulty === filters.difficulty);
    }
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      previews = previews.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.subtitle.toLowerCase().includes(searchLower) ||
          p.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
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
   * Get resource by slug
   */
  getResourceBySlug(slug: string): Observable<Resource | null> {
    const resource = this.metadataCache().find((r) => r.slug === slug);
    return of(resource || null);
  }

  /**
   * Get resource by ID
   */
  getResourceById(id: string): Observable<Resource | null> {
    const resource = this.metadataCache().find((r) => r.id === id);
    return of(resource || null);
  }

  /**
   * Get related resources
   */
  getRelatedResources(
    resource: Resource,
    limit: number = 3
  ): Observable<ResourcePreview[]> {
    let related: ResourcePreview[] = [];
    const displayedPreviews = this.previewsCache().filter((p) => p.display !== false);

    // First, try to get explicitly related resources
    if (resource.relatedResources && resource.relatedResources.length > 0) {
      const relatedById = displayedPreviews.filter((p) =>
        resource.relatedResources!.includes(p.id)
      );
      related = [...relatedById];
    }

    // If not enough, find resources with matching tags
    if (related.length < limit) {
      const byTags = displayedPreviews
        .filter((p) => p.id !== resource.id)
        .filter((p) => p.tags.some((tag) => resource.tags.includes(tag)))
        .slice(0, limit - related.length);
      related = [...related, ...byTags];
    }

    // If still not enough, get from same category
    if (related.length < limit) {
      const byCategory = displayedPreviews
        .filter((p) => p.id !== resource.id)
        .filter((p) => p.category === resource.category)
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
      ...new Set(this.metadataCache().map((r) => r.category)),
    ];
    return of(categories.sort());
  }

  /**
   * Get all tags
   */
  getTags(): Observable<string[]> {
    const tags = new Set<string>();
    this.metadataCache().forEach((resource) => {
      resource.tags.forEach((tag) => tags.add(tag));
    });
    return of([...tags].sort());
  }

  /**
   * Get featured resources
   */
  getFeaturedResources(limit: number = 3): Observable<ResourcePreview[]> {
    const featured = this.previewsCache()
      .filter((p) => p.display !== false)
      .filter((p) => p.featured)
      .slice(0, limit);
    return of(featured);
  }

  /**
   * Get recent resources
   */
  getRecentResources(limit: number = 5): Observable<ResourcePreview[]> {
    const recent = [...this.previewsCache()]
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
   * Get all resources (for cross-linking and content matching)
   */
  getAllResources(): Observable<ResourcePreview[]> {
    // Return all displayed resources
    return of(this.previewsCache().filter((p) => p.display !== false));
  }

  /**
   * Convert Resource metadata to ResourcePreview
   */
  private convertMetadataToPreview(metadata: Resource): ResourcePreview {
    return {
      id: metadata.id,
      slug: metadata.slug,
      title: metadata.title,
      subtitle: metadata.subtitle,
      description: metadata.description,
      externalUrl: metadata.externalUrl,
      publishedDate: metadata.publishedDate,
      thumbnail: metadata.thumbnail,
      tags: metadata.tags,
      category: metadata.category,
      featured: metadata.featured,
      display: metadata.display,
      isPaid: metadata.isPaid,
      difficulty: metadata.difficulty,
    };
  }

  /**
   * Get resources configuration
   */
  getConfig(): ResourcesConfig {
    return { ...this.config };
  }

  /**
   * Get external resource URL (the actual external link)
   */
  getResourceUrl(resource: Resource): string {
    return resource.externalUrl;
  }

  /**
   * Get resource page URL (internal permalink)
   */
  getResourcePageUrl(slug: string): string {
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
