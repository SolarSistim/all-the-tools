import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Artist } from '../models/artist.models';
import { ArtistsService } from '../services/artists.service';

/**
 * Artist Resolver
 * Loads artist data before the route activates
 * This ensures meta tags are set during SSR/prerendering
 */
export const artistResolver: ResolveFn<Artist | null> = (
  route: ActivatedRouteSnapshot
): Observable<Artist | null> => {
  const artistsService = inject(ArtistsService);
  const router = inject(Router);
  const slug = route.paramMap.get('slug');

  if (!slug) {
    router.navigate(['/3d-artist-spotlight']);
    return of(null);
  }

  return artistsService.getArtistBySlug(slug).pipe(
    map((artist) => {
      if (!artist) {
        router.navigate(['/3d-artist-spotlight']);
        return null;
      }
      return artist;
    }),
    catchError(() => {
      router.navigate(['/3d-artist-spotlight']);
      return of(null);
    })
  );
};
