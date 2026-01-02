import { RenderMode, ServerRoute } from '@angular/ssr';
import { BLOG_ARTICLES_METADATA } from './features/blog/data/articles-metadata.data';
import { RESOURCES_METADATA } from './features/resources/data/resources-metadata.data';

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
    path: 'resources/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      // Return all resource slugs for prerendering
      return RESOURCES_METADATA.map(resource => ({ slug: resource.slug }));
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
