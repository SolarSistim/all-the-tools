import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  Artist,
  ArtistPreview,
  PaginatedArtistResponse,
  ArtistsConfig,
  ArtistFilters,
} from '../models/artist.models';
import { ARTISTS_DATA } from '../data/artists.data';

/**
 * ArtistsService
 * Manages artist data, pagination, and retrieval
 * For static prerendered sites - uses client-side pagination
 */
@Injectable({
  providedIn: 'root',
})
export class ArtistsService {
  private readonly config: ArtistsConfig = {
    pageSize: 12,
    baseUrl: 'https://www.allthethings.dev/3d-artist-spotlight',
    defaultOgImage: 'https://www.allthethings.dev/meta-images/og-3d-artists.png',
  };

  // Cache for artist data and previews
  private dataCache = signal<Artist[]>(ARTISTS_DATA);
  private previewsCache = signal<ArtistPreview[]>([]);

  constructor() {
    this.initializePreviewCache();
  }

  /**
   * Initialize artist preview cache
   */
  private initializePreviewCache(): void {
    const previews = this.dataCache().map((artist) =>
      this.convertToPreview(artist)
    );
    this.previewsCache.set(previews);
  }

  /**
   * Get paginated artist previews
   */
  getArtistPreviews(
    page: number = 1,
    pageSize: number = this.config.pageSize,
    filters?: ArtistFilters
  ): Observable<PaginatedArtistResponse<ArtistPreview>> {
    let previews = this.previewsCache();

    // Filter out non-displayed artists (display defaults to true if not specified)
    previews = previews.filter((p) => p.display !== false);

    // Apply filters
    if (filters?.keyword) {
      previews = previews.filter((p) =>
        p.keywords.some((k) => k.toLowerCase() === filters.keyword!.toLowerCase())
      );
    }
    if (filters?.featured !== undefined) {
      previews = previews.filter((p) => p.featured === filters.featured);
    }
    if (filters?.hasVideo !== undefined) {
      previews = previews.filter((p) => p.hasVideo === filters.hasVideo);
    }
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase().trim();
      previews = previews.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.shortDescription.toLowerCase().includes(searchLower) ||
          p.keywords.some((keyword) => keyword.toLowerCase().includes(searchLower))
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
   * Get artist by slug
   */
  getArtistBySlug(slug: string): Observable<Artist | null> {
    const artist = this.dataCache().find((a) => a.slug === slug);
    return of(artist || null);
  }

  /**
   * Get artist by ID
   */
  getArtistById(id: string): Observable<Artist | null> {
    const artist = this.dataCache().find((a) => a.id === id);
    return of(artist || null);
  }

  /**
   * Get related artists based on keywords
   */
  getRelatedArtists(
    artist: Artist,
    limit: number = 3
  ): Observable<ArtistPreview[]> {
    const displayedPreviews = this.previewsCache().filter((p) => p.display !== false);

    // Find artists with matching keywords
    const related = displayedPreviews
      .filter((p) => p.id !== artist.id)
      .map((p) => {
        const matchingKeywords = p.keywords.filter((k) =>
          artist.keywords.includes(k)
        ).length;
        return { preview: p, score: matchingKeywords };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.preview);

    return of(related);
  }

  /**
   * Get all unique keywords
   */
  getKeywords(): Observable<string[]> {
    const keywords = new Set<string>();
    this.dataCache().forEach((artist) => {
      artist.keywords.forEach((keyword) => keywords.add(keyword));
    });
    return of([...keywords].sort());
  }

  /**
   * Get featured artists
   */
  getFeaturedArtists(limit: number = 3): Observable<ArtistPreview[]> {
    const featured = this.previewsCache()
      .filter((p) => p.display !== false)
      .filter((p) => p.featured)
      .slice(0, limit);
    return of(featured);
  }

  /**
   * Get recent artists
   */
  getRecentArtists(limit: number = 5): Observable<ArtistPreview[]> {
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
   * Search artists by query (for autocomplete)
   */
  searchArtists(query: string, limit: number = 10): Observable<ArtistPreview[]> {
    if (!query || query.trim() === '') {
      return of([]);
    }

    const searchLower = query.toLowerCase().trim();
    const results = this.previewsCache()
      .filter((p) => p.display !== false)
      .filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.shortDescription.toLowerCase().includes(searchLower) ||
          p.keywords.some((k) => k.toLowerCase().includes(searchLower))
      )
      .slice(0, limit);

    return of(results);
  }

  /**
   * Convert Artist to ArtistPreview
   */
  private convertToPreview(artist: Artist): ArtistPreview {
    return {
      id: artist.id,
      slug: artist.slug,
      name: artist.name,
      shortDescription: artist.shortDescription,
      keywords: artist.keywords,
      image: artist.image,
      ogImage: artist.ogImage,
      publishedDate: artist.publishedDate,
      featured: artist.featured,
      display: artist.display,
      hasVideo: !!artist.youtubeVideoId,
      youtubeVideoId: artist.youtubeVideoId,
      youtubeVideos: artist.youtubeVideos,
    };
  }

  /**
   * Get artists configuration
   */
  getConfig(): ArtistsConfig {
    return { ...this.config };
  }

  /**
   * Get artist page URL (internal permalink)
   */
  getArtistPageUrl(slug: string): string {
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
