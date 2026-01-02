import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Resource } from '../models/resource.models';
import { ResourcesService } from '../services/resources.service';

/**
 * Resource Resolver
 * Loads resource data before the route activates
 * This ensures meta tags are set during SSR/prerendering
 */
export const resourceResolver: ResolveFn<Resource | null> = (
  route: ActivatedRouteSnapshot
): Observable<Resource | null> => {
  const resourcesService = inject(ResourcesService);
  const router = inject(Router);
  const slug = route.paramMap.get('slug');

  if (!slug) {
    router.navigate(['/resources']);
    return of(null);
  }

  return resourcesService.getResourceBySlug(slug).pipe(
    map((resource) => {
      if (!resource) {
        router.navigate(['/resources']);
        return null;
      }
      return resource;
    }),
    catchError(() => {
      router.navigate(['/resources']);
      return of(null);
    })
  );
};
