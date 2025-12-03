import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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

  return blogService.getArticleBySlug(slug).pipe(
    map((article) => {
      if (!article) {
        router.navigate(['/blog']);
        return null;
      }
      return article;
    }),
    catchError(() => {
      router.navigate(['/blog']);
      return of(null);
    })
  );
};
