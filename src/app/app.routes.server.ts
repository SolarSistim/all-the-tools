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
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
