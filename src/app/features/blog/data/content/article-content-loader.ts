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
      case 'the-16-wealthiest-criminals-of-the-last-100-years':
        const wealthiestCriminalsModule = await import('./the-16-wealthiest-criminals-of-the-last-100-years.content');
        return wealthiestCriminalsModule.content;

      case 'snow-globe-shake-demo':
        const snowGlobeModule = await import('./snow-globe-shake-demo.content');
        return snowGlobeModule.SNOW_GLOBE_SHAKE_DEMO.content;

      case 'base-number-converter-tutorial':
        const baseConverterModule = await import('./how-to-use-the-base-number-converter-tool.content');
        return baseConverterModule.content;

      case 'blog-components-showcase':
        const showcaseModule = await import('./blog-components-showcase.content');
        return showcaseModule.BLOG_COMPONENTS_SHOWCASE.content;

      case 'one-man-one-pc-cinema-quality-starships-howard-day':
        const howardDayModule = await import('./one-man-one-pc-cinema-quality-starships-howard-day.content');
        return howardDayModule.ONE_MAN_ONE_PC_CINEMA_QUALITY_STARSHIPS_HOWARD_DAY.content;

      case 'pensacola-snow-second-year':
        const pensacolaSnow2026Module = await import('./it-happened-again-pensacola-wakes-up-to-snow-for-the-second-january-in-a-row.content');
        return pensacolaSnow2026Module.IT_HAPPENED_AGAIN_PENSACOLA_WAKES_UP_TO_SNOW_FOR_THE_SECOND_JANUARY_IN_A_ROW.content;

      case 'when-snowflakes-land-on-the-sunshine-state-pensacola-braces-for-another-unlikely-winter':
        const pensacolaSnowModule = await import('./when-snowflakes-land-on-the-sunshine-state-pensacola-braces-for-another-unlikely-winter.content');
        return pensacolaSnowModule.content;

      case 'how-to-use-the-barcode-scanner-tool':
        const barcodeScannerModule = await import('./how-to-use-the-barcode-scanner-tool.content');
        return barcodeScannerModule.content;

      case 'when-your-monster-becomes-your-friend-how-badlands-demystifies-the-yautja':
        const badlandsModule = await import('./when-your-monster-becomes-your-friend-how-badlands-demystifies-the-yautja.content');
        return badlandsModule.content;

      case 'we-need-to-talk-about-that-wormhole-scene-in-interstellar':
        const interstellarModule = await import('./we-need-to-talk-about-that-wormhole-scene-in-interstellar.content');
        return interstellarModule.content;

      case 'how-to-sell-your-timber-for-top-dollar-in-ohio':
        const timberModule = await import('./how-to-sell-your-timber-for-top-dollar-in-ohio.content');
        return timberModule.content;

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

      case 'why-pensacon-has-gone-downhill':
        const pensaconModule = await import('./why-pensacon-has-gone-downhill.content');
        return pensaconModule.content;

      case 'pensacon-responds-inside-the-uphill-battle-to-save-pensacolas-biggest-convention':
        const pensaconRespondsModule = await import('./pensacon-responds-inside-the-uphill-battle-to-save-pensacolas-biggest-convention.content');
        return pensaconRespondsModule.content;

      case 'lighthuggers-when-fan-art-captures-the-impossible':
        const lighthuggersModule = await import('./lighthuggers-when-fan-art-captures-the-impossible.content');
        return lighthuggersModule.content;

      case 'stop-typing-in-those-tiny-on-reward-codes-by-hand':
        const onRewardModule = await import('./stop-typing-in-those-tiny-on-reward-codes-by-hand.content');
        return onRewardModule.content;

      case 'the-silent-502-solving-internal-proxy-conflicts-in-self-hosted-postiz':
        const postizModule = await import('./the-silent-502-solving-internal-proxy-conflicts-in-self-hosted-postiz.content');
        return postizModule.content;

      default:
        console.warn(`No content file found for article: ${slug}`);
        return null;
    }
  } catch (error) {
    console.error(`Failed to load content for article: ${slug}`, error);

    // Log specific error details for debugging
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        userAgent: navigator.userAgent
      });
    }

    return null;
  }
}
