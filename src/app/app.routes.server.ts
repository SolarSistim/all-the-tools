import { RenderMode, ServerRoute } from '@angular/ssr';
import { BLOG_ARTICLES_METADATA } from './features/blog/data/articles-metadata.data';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      // Return all article slugs for prerendering
      return BLOG_ARTICLES_METADATA.map(article => ({ slug: article.slug }));
    }
  },
  // Use client-side rendering for all other routes (including static assets)
  // This prevents prerendering from trying to create HTML for image paths
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
