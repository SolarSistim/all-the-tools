import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin, shareReplay } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import {
  Artist,
  ArtistPreview,
  PaginatedArtistResponse,
  ArtistsConfig,
  ArtistFilters,
} from '../models/artist.models';
import { environment } from '../../../../environments/environment';

/**
 * ArtistsService
 *
 * artists.json  — lightweight index (IDs only, ordered newest-first)
 * previews/{slug}.json — listing card data, fetched per page
 * artists/{slug}.json  — full artist data, fetched on detail page only
 */
@Injectable({
  providedIn: 'root',
})
export class ArtistsService {
  private http = inject(HttpClient);

  private readonly config: ArtistsConfig = {
    pageSize: 12,
    baseUrl: 'https://www.allthethings.dev/3d-artist-spotlight',
    defaultOgImage: 'https://www.allthethings.dev/meta-images/og-3d-artists.png',
  };

  private readonly apiUrl = environment.artistsUrl;

  // Ordered slug list from artists.json
  private indexSlugs: string[] | null = null;
  private indexFetch$: Observable<string[]> | null = null;

  // Preview cache (listing only)
  private previewCache = new Map<string, ArtistPreview>();
  private previewFetches = new Map<string, Observable<ArtistPreview | null>>();

  // Full artist cache (detail page)
  private artistCache = new Map<string, Artist>();
  private artistFetches = new Map<string, Observable<Artist | null>>();

  // ── Index ────────────────────────────────────────────────────────────────

  private fetchIndex(): Observable<string[]> {
    if (this.indexSlugs) return of(this.indexSlugs);
    if (!this.indexFetch$) {
      this.indexFetch$ = this.http
        .get<{ artists: { id: string }[] }>(`${this.apiUrl}/artists.json`)
        .pipe(
          map((response) => {
            const slugs = response.artists.map((a) => a.id);
            this.indexSlugs = slugs;
            return slugs;
          }),
          shareReplay(1)
        );
    }
    return this.indexFetch$;
  }

  // ── Preview (listing) ────────────────────────────────────────────────────

  private fetchPreview(slug: string): Observable<ArtistPreview | null> {
    if (this.previewCache.has(slug)) {
      return of(this.previewCache.get(slug)!);
    }
    if (!this.previewFetches.has(slug)) {
      this.previewFetches.set(
        slug,
        this.http.get<ArtistPreview>(`${this.apiUrl}/previews/${slug}.json`).pipe(
          map((p) => ({ ...p, hasVideo: !!p.youtubeVideoId })),
          tap((p) => this.previewCache.set(slug, p)),
          catchError(() => of(null)),
          shareReplay(1)
        )
      );
    }
    return this.previewFetches.get(slug)!;
  }

  // ── Full artist (detail page) ────────────────────────────────────────────

  private fetchArtist(slug: string): Observable<Artist | null> {
    if (this.artistCache.has(slug)) {
      return of(this.artistCache.get(slug)!);
    }
    if (!this.artistFetches.has(slug)) {
      this.artistFetches.set(
        slug,
        this.http.get<Artist>(`${this.apiUrl}/artists/${slug}.json`).pipe(
          tap((a) => this.artistCache.set(slug, a)),
          catchError(() => of(null)),
          shareReplay(1)
        )
      );
    }
    return this.artistFetches.get(slug)!;
  }

  // ── Public API ───────────────────────────────────────────────────────────

  getArtistPreviews(
    page: number = 1,
    pageSize: number = this.config.pageSize,
    filters?: ArtistFilters
  ): Observable<PaginatedArtistResponse<ArtistPreview>> {
    return this.fetchIndex().pipe(
      switchMap((slugs) => {
        const hasFilters = !!(
          filters?.keyword ||
          filters?.search ||
          filters?.featured !== undefined ||
          filters?.hasVideo !== undefined
        );

        const slugsToFetch = hasFilters
          ? slugs
          : slugs.slice((page - 1) * pageSize, page * pageSize);

        if (slugsToFetch.length === 0) {
          return of({
            items: [] as ArtistPreview[],
            currentPage: page,
            pageSize,
            totalItems: slugs.length,
            totalPages: Math.ceil(slugs.length / pageSize),
          });
        }

        return forkJoin(slugsToFetch.map((s) => this.fetchPreview(s))).pipe(
          map((previews) => {
            let items = (previews.filter(Boolean) as ArtistPreview[]).filter(
              (p) => p.display !== false
            );

            if (filters?.keyword) {
              items = items.filter((p) =>
                p.keywords.some(
                  (k) => k.toLowerCase() === filters.keyword!.toLowerCase()
                )
              );
            }
            if (filters?.featured !== undefined) {
              items = items.filter((p) => p.featured === filters.featured);
            }
            if (filters?.hasVideo !== undefined) {
              items = items.filter((p) => p.hasVideo === filters.hasVideo);
            }
            if (filters?.search) {
              const q = filters.search.toLowerCase().trim();
              items = items.filter(
                (p) =>
                  p.name.toLowerCase().includes(q) ||
                  p.shortDescription.toLowerCase().includes(q) ||
                  p.keywords.some((k) => k.toLowerCase().includes(q))
              );
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

  getArtistBySlug(slug: string): Observable<Artist | null> {
    return this.fetchArtist(slug);
  }

  getArtistById(id: string): Observable<Artist | null> {
    return this.getArtistBySlug(id);
  }

  getRelatedArtists(
    artist: Artist,
    limit: number = 3
  ): Observable<ArtistPreview[]> {
    const cached = [...this.previewCache.values()].filter(
      (p) => p.display !== false
    );
    const related = cached
      .filter((p) => p.id !== artist.id)
      .map((p) => {
        const score = p.keywords.filter((k) => artist.keywords.includes(k)).length;
        return { preview: p, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.preview);

    return of(related);
  }

  getKeywords(): Observable<string[]> {
    const keywords = new Set<string>();
    this.previewCache.forEach((p) => p.keywords.forEach((k) => keywords.add(k)));
    return of([...keywords].sort());
  }

  getFeaturedArtists(limit: number = 3): Observable<ArtistPreview[]> {
    return this.fetchIndex().pipe(
      switchMap((slugs) =>
        forkJoin(slugs.slice(0, limit * 3).map((s) => this.fetchPreview(s))).pipe(
          map((previews) =>
            (previews.filter(Boolean) as ArtistPreview[])
              .filter((p) => p.display !== false && p.featured)
              .slice(0, limit)
          )
        )
      )
    );
  }

  getRecentArtists(limit: number = 5): Observable<ArtistPreview[]> {
    return this.fetchIndex().pipe(
      switchMap((slugs) =>
        forkJoin(slugs.slice(0, limit).map((s) => this.fetchPreview(s))).pipe(
          map((previews) =>
            (previews.filter(Boolean) as ArtistPreview[]).filter(
              (p) => p.display !== false
            )
          )
        )
      )
    );
  }

  searchArtists(query: string, limit: number = 10): Observable<ArtistPreview[]> {
    if (!query || query.trim() === '') return of([]);

    return this.fetchIndex().pipe(
      switchMap((slugs) =>
        forkJoin(slugs.map((s) => this.fetchPreview(s))).pipe(
          map((previews) => {
            const q = query.toLowerCase().trim();
            return (previews.filter(Boolean) as ArtistPreview[])
              .filter((p) => p.display !== false)
              .filter(
                (p) =>
                  p.name.toLowerCase().includes(q) ||
                  p.shortDescription.toLowerCase().includes(q) ||
                  p.keywords.some((k) => k.toLowerCase().includes(q))
              )
              .slice(0, limit);
          })
        )
      )
    );
  }

  getConfig(): ArtistsConfig {
    return { ...this.config };
  }

  getArtistPageUrl(slug: string): string {
    return `${this.config.baseUrl}/${slug}`;
  }

  getListingUrl(page: number = 1): string {
    return page === 1
      ? this.config.baseUrl
      : `${this.config.baseUrl}?page=${page}`;
  }
}
