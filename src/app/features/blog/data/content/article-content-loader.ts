import { ContentBlock } from '../../models/blog.models';

/**
 * Article Content Loader
 * Dynamically imports article content based on slug
 */

// Type for content modules
export type ArticleContentModule = {
  content: ContentBlock[];
};

// Map of article slugs to their content imports
const contentModules: { [slug: string]: () => Promise<ArticleContentModule> } = {
  'getting-started-with-web-development-tools': () => import('./getting-started-with-web-development-tools.content'),
  'mastering-css-grid-layout': () => import('./mastering-css-grid-layout.content'),
  'productivity-hacks-for-developers': () => import('./productivity-hacks-for-developers.content'),
  'javascript-array-methods-guide': () => import('./javascript-array-methods-guide.content'),
  'building-accessible-websites': () => import('./building-accessible-websites.content'),
  'typescript-basics-for-beginners': () => import('./typescript-basics-for-beginners.content'),
  'css-flexbox-quick-guide': () => import('./css-flexbox-quick-guide.content'),
  'git-workflow-best-practices': () => import('./git-workflow-best-practices.content'),
  'responsive-design-tips': () => import('./responsive-design-tips.content'),
  'api-design-principles': () => import('./api-design-principles.content'),
  'debugging-javascript-errors': () => import('./debugging-javascript-errors.content'),
  'sass-vs-less-comparison': () => import('./sass-vs-less-comparison.content'),
  'async-await-explained': () => import('./async-await-explained.content'),
  'docker-basics-guide': () => import('./docker-basics-guide.content'),
  'webpack-configuration-guide': () => import('./webpack-configuration-guide.content'),
  'react-vs-angular-comparison': () => import('./react-vs-angular-comparison.content'),
  'node-js-performance-tips': () => import('./node-js-performance-tips.content'),
  'mongodb-schema-design': () => import('./mongodb-schema-design.content'),
  'vue-composition-api': () => import('./vue-composition-api.content'),
  'graphql-introduction': () => import('./graphql-introduction.content'),
  'web-security-essentials': () => import('./web-security-essentials.content'),
};

/**
 * Load article content by slug
 * @param slug Article slug
 * @returns Promise of content blocks array
 */
export async function loadArticleContent(slug: string): Promise<ContentBlock[] | null> {
  const contentLoader = contentModules[slug];

  if (!contentLoader) {
    console.error(`No content found for article slug: ${slug}`);
    return null;
  }

  try {
    const module = await contentLoader();
    return module.content;
  } catch (error) {
    console.error(`Error loading content for article: ${slug}`, error);
    return null;
  }
}

/**
 * Check if content exists for a given slug
 * @param slug Article slug
 * @returns boolean
 */
export function hasArticleContent(slug: string): boolean {
  return slug in contentModules;
}
