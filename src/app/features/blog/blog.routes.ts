import { Routes } from '@angular/router';
import { articleResolver } from './resolvers/article.resolver';

/**
 * Blog Routes
 * Lazy-loaded routes for the blog feature
 */
export const BLOG_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/blog-listing/blog-listing.component').then(
        (m) => m.BlogListingComponent
      ),
    title: 'Blog | All The Things',
  },
  {
    path: ':slug',
    resolve: {
      article: articleResolver,
    },
    loadComponent: () =>
      import('./components/blog-article/blog-article.component').then(
        (m) => m.BlogArticleComponent
      ),
    title: 'Article | All The Things Blog',
  },
];
