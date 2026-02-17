import { RenderMode, ServerRoute } from '@angular/ssr';
import { BLOG_ARTICLES_METADATA } from './features/blog/data/articles-metadata.data';
import { RESOURCES_METADATA } from './features/resources/data/resources-metadata.data';
import { ARTISTS_DATA } from './features/in-the-verse-artist-list/data/artists.data';

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
    path: '3d-artist-spotlight/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      // Return all artist slugs for prerendering
      return ARTISTS_DATA.filter(artist => artist.display !== false).map(artist => ({ slug: artist.slug }));
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
    path: 'tools/base-number-converter/:pair',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      // Return all base number conversion pair slugs for prerendering
      return [
        // Binary conversions (most popular)
        { pair: 'binary-to-decimal' },
        { pair: 'decimal-to-binary' },
        { pair: 'binary-to-hexadecimal' },
        { pair: 'hexadecimal-to-binary' },
        { pair: 'binary-to-octal' },
        { pair: 'octal-to-binary' },
        // Hexadecimal conversions
        { pair: 'decimal-to-hexadecimal' },
        { pair: 'hexadecimal-to-decimal' },
        { pair: 'octal-to-hexadecimal' },
        { pair: 'hexadecimal-to-octal' },
        // Octal conversions
        { pair: 'decimal-to-octal' },
        { pair: 'octal-to-decimal' },
        // Duodecimal conversions
        { pair: 'decimal-to-duodecimal' },
        { pair: 'duodecimal-to-decimal' },
        { pair: 'binary-to-duodecimal' },
        { pair: 'duodecimal-to-binary' },
        { pair: 'octal-to-duodecimal' },
        { pair: 'duodecimal-to-octal' },
        { pair: 'hexadecimal-to-duodecimal' },
        { pair: 'duodecimal-to-hexadecimal' },
        // Base-36 conversions
        { pair: 'decimal-to-base36' },
        { pair: 'base36-to-decimal' },
        { pair: 'binary-to-base36' },
        { pair: 'base36-to-binary' },
        { pair: 'octal-to-base36' },
        { pair: 'base36-to-octal' },
        { pair: 'hexadecimal-to-base36' },
        { pair: 'base36-to-hexadecimal' },
        { pair: 'duodecimal-to-base36' },
        { pair: 'base36-to-duodecimal' },
      ];
    }
  },
  {
    path: 'tools/percentage-calculator/:variant',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      // Return all percentage calculator variant slugs for prerendering
      return [
        { variant: 'percentage-increase-decrease' },
        { variant: 'discount-calculator' },
        { variant: 'tax-calculator' },
        { variant: 'profit-margin' },
        { variant: 'markup-calculator' },
      ];
    }
  },
  {
    path: 'tools/currency-converter/:pair',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      // Return all currency converter pair slugs for prerendering (major currencies)
      return [
        // USD conversions
        { pair: 'us-dollar-to-euro' },
        { pair: 'us-dollar-to-british-pound' },
        { pair: 'us-dollar-to-japanese-yen' },
        { pair: 'us-dollar-to-canadian-dollar' },
        { pair: 'us-dollar-to-australian-dollar' },
        { pair: 'us-dollar-to-swiss-franc' },
        // EUR conversions
        { pair: 'euro-to-us-dollar' },
        { pair: 'euro-to-british-pound' },
        { pair: 'euro-to-japanese-yen' },
        { pair: 'euro-to-canadian-dollar' },
        { pair: 'euro-to-australian-dollar' },
        { pair: 'euro-to-swiss-franc' },
        // GBP conversions
        { pair: 'british-pound-to-us-dollar' },
        { pair: 'british-pound-to-euro' },
        { pair: 'british-pound-to-japanese-yen' },
        { pair: 'british-pound-to-canadian-dollar' },
        { pair: 'british-pound-to-australian-dollar' },
        { pair: 'british-pound-to-swiss-franc' },
        // JPY conversions
        { pair: 'japanese-yen-to-us-dollar' },
        { pair: 'japanese-yen-to-euro' },
        { pair: 'japanese-yen-to-british-pound' },
        { pair: 'japanese-yen-to-canadian-dollar' },
        { pair: 'japanese-yen-to-australian-dollar' },
        { pair: 'japanese-yen-to-swiss-franc' },
        // CAD conversions
        { pair: 'canadian-dollar-to-us-dollar' },
        { pair: 'canadian-dollar-to-euro' },
        { pair: 'canadian-dollar-to-british-pound' },
        { pair: 'canadian-dollar-to-japanese-yen' },
        { pair: 'canadian-dollar-to-australian-dollar' },
        { pair: 'canadian-dollar-to-swiss-franc' },
        // AUD conversions
        { pair: 'australian-dollar-to-us-dollar' },
        { pair: 'australian-dollar-to-euro' },
        { pair: 'australian-dollar-to-british-pound' },
        { pair: 'australian-dollar-to-japanese-yen' },
        { pair: 'australian-dollar-to-canadian-dollar' },
        { pair: 'australian-dollar-to-swiss-franc' },
        // CHF conversions
        { pair: 'swiss-franc-to-us-dollar' },
        { pair: 'swiss-franc-to-euro' },
        { pair: 'swiss-franc-to-british-pound' },
        { pair: 'swiss-franc-to-japanese-yen' },
        { pair: 'swiss-franc-to-canadian-dollar' },
        { pair: 'swiss-franc-to-australian-dollar' },
      ];
    }
  },
  {
    path: 'account',
    renderMode: RenderMode.Client
  },
  {
    path: 'account/:tab',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
