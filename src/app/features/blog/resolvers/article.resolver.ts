import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, race, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Article } from '../models/blog.models';
import { BlogService } from '../services/blog.service';

/**
 * Article Resolver
 * Loads article data before the route activates
 * This ensures meta tags are set during SSR/prerendering
 */
export const articleResolver: ResolveFn<Article | null> = (
  route: ActivatedRouteSnapshot
): Observable<Article | null> => {
  const blogService = inject(BlogService);
  const router = inject(Router);
  const slug = route.paramMap.get('slug');

  if (!slug) {
    router.navigate(['/blog']);
    return of(null);
  }

  // Add resolver-level timeout for Safari compatibility
  const articleLoad$ = blogService.getArticleBySlug(slug).pipe(
    map((article) => {
      if (!article) {
        console.error(`Article not found: ${slug}`);
        router.navigate(['/blog']);
        return null;
      }
      return article;
    }),
    catchError((error) => {
      console.error(`Error loading article: ${slug}`, error);
      router.navigate(['/blog']);
      return of(null);
    })
  );

  // Race against a 8-second timeout
  const timeout$ = timer(8000).pipe(
    switchMap(() => {
      console.error(`Article load timeout after 8 seconds: ${slug}`);
      console.error('User agent:', navigator.userAgent);
      router.navigate(['/blog']);
      return of(null);
    })
  );

  return race(articleLoad$, timeout$);
};
