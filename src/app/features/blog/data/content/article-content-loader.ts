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
      case 'c-beams-the-top-down-space-action-rpg-that-gets-it':
        const cBeamsModule = await import('./c-beams-the-top-down-space-action-rpg-that-gets-it.content');
        return cBeamsModule.content;

      case 'the-top-ten-worst-movie-remakes':
        const remakesModule = await import('./the-top-ten-best-and-worst-movie-remakes.content');
        return remakesModule.content;

      case 'kenyas-tech-scene-how-a-bunch-of-developers-built-stuff-that-changed-the-world':
        const kenyaModule = await import('./kenyas-tech-scene-how-a-bunch-of-developers-built-stuff-that-changed-the-world.content');
        return kenyaModule.content;

      case 'when-nicholas-cage-made-a-better-five-nights-at-freddys-movie-than-five-nights-at-freddys':
        const willysModule = await import('./when-nicholas-cage-made-a-better-five-nights-at-freddys-movie-than-five-nights-at-freddys.content');
        return willysModule.content;

      case 'we-remember-why-your-childhood-tv-habits-might-become-a-professional-credential':
        const weRememberModule = await import('./we-remember-why-your-childhood-tv-habits-might-become-a-professional-credential.content');
        return weRememberModule.content;

      case 'the-invisible-door-how-noise-cancelling-headphones-saved-my-programming-career':
        const headphonesModule = await import('./the-invisible-door-how-noise-cancelling-headphones-saved-my-programming-career.content');
        return headphonesModule.content;

      case 'my-wife-and-i-have-visited-george-bistro-nearly-30-times':
        const georgeModule = await import('./my-wife-and-i-have-visited-george-bistro-nearly-30-times.content');
        return georgeModule.content;

      case 'i-built-a-roku-compatibility-checker':
        const rokuModule = await import('./i-built-a-roku-compatibility-checker.content');
        return rokuModule.content;

      case 'these-song-lyrics-do-not-tease-the-grinch-they-unload-on-him':
        const grinchModule = await import('./these-song-lyrics-do-not-tease-the-grinch-they-unload-on-him.content');
        return grinchModule.content;

      case 'the-deneb-paradox-when-first-contact-means-last-contact':
        const denebModule = await import('./the-deneb-paradox-when-first-contact-means-last-contact.content');
        return denebModule.content;

      case 'how-to-calculate-percentages-in-your-head':
        const percentagesModule = await import('./how-to-calculate-percentages-in-your-head.content');
        return percentagesModule.content;

      case 'why-truckers-drift-to-the-right-on-the-highway':
        const truckersModule = await import('./why-truckers-drift-to-the-right-on-the-highway.content');
        return truckersModule.content;

      case 'wordpress-vs-angular-why-i-built-my-site-with-zero-backend':
        const wpModule = await import('./wordpress-vs-angular-why-i-built-my-site-with-zero-backend.content');
        return wpModule.content;

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
