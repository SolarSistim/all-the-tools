import { ContentBlock } from '../../models/blog.models';

/**
 * Load article content by slug
 * Uses explicit imports so the bundler knows which files to include
 */
export async function loadArticleContent(
  slug: string
): Promise<ContentBlock[] | null> {
  try {
    // Explicit import mapping for each article
    switch (slug) {
      case 'getting-started-with-web-development-tools':
        const module = await import('./getting-started-with-web-development-tools.content');
        return module.content;

      default:
        console.warn(`No content file found for article: ${slug}`);
        return null;
    }
  } catch (error) {
    console.error(`Failed to load content for article: ${slug}`, error);
    return null;
  }
}
