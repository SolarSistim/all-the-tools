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
    path: 'tools/unit-converter/:pair',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      // Return all conversion pair slugs for prerendering
      return [
        // Length conversions
        { pair: 'centimeter-to-inch' },
        { pair: 'inch-to-centimeter' },
        { pair: 'mile-to-kilometer' },
        { pair: 'kilometer-to-mile' },
        { pair: 'foot-to-meter' },
        { pair: 'meter-to-foot' },
        // Weight conversions
        { pair: 'kilogram-to-pound' },
        { pair: 'pound-to-kilogram' },
        { pair: 'kilogram-to-gram' },
        { pair: 'gram-to-ounce' },
        { pair: 'ounce-to-gram' },
        // Temperature conversions
        { pair: 'celsius-to-fahrenheit' },
        { pair: 'fahrenheit-to-celsius' },
        // Volume conversions
        { pair: 'liter-to-gallon' },
        { pair: 'milliliter-to-fluid-ounce' },
        { pair: 'cup-to-milliliter' },
        // Area conversions
        { pair: 'square-meter-to-square-foot' },
        // Speed conversions
        { pair: 'kilometer-per-hour-to-mile-per-hour' },
        { pair: 'knot-to-mile-per-hour' },
      ];
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
