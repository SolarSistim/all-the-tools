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
      case 'i-switched-from-facebook-to-reddit-for-doomscrolling':
        const redditModule = await import('./i-switched-from-facebook-to-reddit-for-doomscrolling.content');
        return redditModule.content;

      case 'the-wild-story-of-the-gaudy-palace-on-scenic-highway':
        const palaceModule = await import('./the-wild-story-of-the-gaudy-palace-on-scenic-highway.content');
        return palaceModule.content;

      default:
        console.warn(`No content file found for article: ${slug}`);
        return null;
    }
  } catch (error) {
    console.error(`Failed to load content for article: ${slug}`, error);
    return null;
  }
}
