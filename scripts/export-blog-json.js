/**
 * export-blog-json.js
 *
 * Converts the Angular blog's TypeScript data files into the three-tier
 * JSON architecture used by json.allthethings.dev:
 *
 *   blog/blog.json                 — index (slugs only, newest-first)
 *   blog/previews/{slug}.json      — lightweight listing-card data
 *   blog/articles/{slug}.json      — full article including content blocks
 *
 * Run from the Angular project root:
 *   node scripts/export-blog-json.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// ── Paths ────────────────────────────────────────────────────────────────────

const PROJECT_ROOT    = path.join(__dirname, '..');
const CONTENT_DIR     = path.join(PROJECT_ROOT, 'src/app/features/blog/data/content');
const JSON_REPO_ROOT  = path.join(PROJECT_ROOT, '..', 'all-the-tools-json');
const OUTPUT_DIR      = path.join(JSON_REPO_ROOT, 'blog');
const PREVIEWS_DIR    = path.join(OUTPUT_DIR, 'previews');
const ARTICLES_DIR    = path.join(OUTPUT_DIR, 'articles');

// ── Author ───────────────────────────────────────────────────────────────────

const JOEL_HANSEN = {
  id: 'joel_hansen',
  name: 'Joel Hansen',
  bio: "Joel Hansen is a full-stack problem-solver, spends days crafting Angular front ends, taming complex Node backends, and bending C# to his will. By night, Joel moonlights as an amateur sleuth \u2014 known for unraveling mysteries from puzzling codebases to actual real-world oddities.",
  avatar: '/assets/author-images/joel_hansen.jpg',
  socialLinks: {}
};

// ── ID \u2192 Slug mapping (from old numeric IDs to new slug-based IDs) ──────────────

const ID_TO_SLUG = {
  '1':   'the-wild-story-of-the-gaudy-palace-on-scenic-highway',
  '2':   'i-switched-from-facebook-to-reddit-for-doomscrolling',
  '3':   'wordpress-vs-angular-why-i-built-my-site-with-zero-backend',
  '4':   'why-truckers-drift-to-the-right-on-the-highway',
  '5':   'how-to-calculate-percentages-in-your-head',
  '6':   'the-deneb-paradox-when-first-contact-means-last-contact',
  '7':   'these-song-lyrics-do-not-tease-the-grinch-they-unload-on-him',
  '8':   'i-built-a-roku-compatibility-checker',
  '9':   'my-wife-and-i-have-visited-george-bistro-nearly-30-times',
  '10':  'the-invisible-door-how-noise-cancelling-headphones-saved-my-programming-career',
  '11':  'we-remember-why-your-childhood-tv-habits-might-become-a-professional-credential',
  '12':  'when-nicholas-cage-made-a-better-five-nights-at-freddys-movie-than-five-nights-at-freddys',
  '13':  'kenyas-tech-scene-how-a-bunch-of-developers-built-stuff-that-changed-the-world',
  '14':  'the-top-ten-worst-movie-remakes',
  '15':  'c-beams-the-top-down-space-action-rpg-that-gets-it',
  '16':  'how-to-sell-your-timber-for-top-dollar-in-ohio',
  '17':  'we-need-to-talk-about-that-wormhole-scene-in-interstellar',
  '18':  'why-pensacon-has-gone-downhill',
  '19':  'pensacon-responds-inside-the-uphill-battle-to-save-pensacolas-biggest-convention',
  '20':  'lighthuggers-when-fan-art-captures-the-impossible',
  '21':  'stop-typing-in-those-tiny-on-reward-codes-by-hand',
  '22':  'the-silent-502-solving-internal-proxy-conflicts-in-self-hosted-postiz',
  '23':  'when-your-monster-becomes-your-friend-how-badlands-demystifies-the-yautja',
  '24':  'how-to-use-the-barcode-scanner-tool',
  '25':  'when-snowflakes-land-on-the-sunshine-state-pensacola-braces-for-another-unlikely-winter',
  '26':  'pensacola-snow-second-year',
  '27':  'one-man-one-pc-cinema-quality-starships-howard-day',
  '100': 'blog-components-showcase',
  '101': 'base-number-converter-tutorial',
  '102': 'the-16-wealthiest-criminals-of-the-last-100-years',
  '103': 'snow-globe-shake-demo',
  '104': 'masters-of-the-universe-2026-he-man-returns-to-the-big-screen',
  '105': 'exploding-trees-in-winter-what-causes-the-loud-cracks',
  '106': 'how-to-use-social-media-launchpad-copy-paste-launch',
  '107': 'gradient-generator-tutorial-css-gradients',
  '108': 'photo-filter-studio-tutorial',
  '109': 'birthday-freebies-guide-100-deals',
  '110': 'pensacola-bay-center-the-189-million-question-renovate-replace-or-watch-mobile-win',
  '111': 'pensacola-mexican-food-trucks-guide',
  '112': 'roku-tv-black-screen-defect-class-action-lawsuit',
  '113': 'fixing-tailscale-stuck-on-starting-windows-10-docker-hyper-v'
};

// ── Content file \u2192 slug overrides (where filename \u2260 slug) ────────────────────────

const FILE_TO_SLUG = {
  'how-to-use-the-base-number-converter-tool':                                            'base-number-converter-tutorial',
  'the-top-ten-best-and-worst-movie-remakes':                                             'the-top-ten-worst-movie-remakes',
  'it-happened-again-pensacola-wakes-up-to-snow-for-the-second-january-in-a-row':        'pensacola-snow-second-year',
  'pensacola-food-trucks-complete-guide':                                                 'pensacola-mexican-food-trucks-guide',
  'how-to-use-gradient-generator-css-gradients':                                         'gradient-generator-tutorial-css-gradients',
  'birthday-freebies-are-the-last-bribe-society-offers-you':                             'birthday-freebies-guide-100-deals',
};

// ── Article metadata (inlined from articles-metadata.data.ts) ───────────────

const ARTICLES_METADATA = [
  {
    slug: 'fixing-tailscale-stuck-on-starting-windows-10-docker-hyper-v',
    title: 'Fixing \u201cTailscale Stuck on Starting\u2026\u201d on Windows 10 (Docker Desktop / Hyper-V Systems)',
    description: 'Tailscale stuck on \u201cStarting\u2026\u201d on Windows 10? This guide walks through the complete fix for Docker Desktop, Hyper-V, and WSL2 systems where the Wintun driver fails to initialize due to corrupted network stack bindings.',
    publishedDate: '02-15-2026',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/Tailscale%20stuck%20on%20starting.../tailscale-windows-fix.jpg?updatedAt=1771178037021', alt: 'Fixing Tailscale Stuck on Starting on Windows 10 with Docker Desktop and Hyper-V' },
    tags: ['Tailscale', 'Windows 10', 'Docker Desktop', 'Hyper-V', 'WSL2', 'Networking', 'VPN', 'Troubleshooting', 'Tutorial'],
    category: 'Technology',
    metaDescription: 'Fix Tailscale stuck on \u201cStarting\u2026\u201d on Windows 10. Complete guide for Docker Desktop, Hyper-V, and WSL2 systems. Learn how to reset the Windows network stack and reinstall the Wintun driver properly.',
    metaKeywords: ['tailscale', 'tailscale windows', 'tailscale stuck starting', 'tailscale not working', 'tailscale windows 10', 'tailscale docker', 'tailscale hyper-v', 'tailscale wsl2', 'wintun driver', 'tailscale tunnel adapter', 'netcfg -d', 'windows network stack reset', 'tailscale troubleshooting', 'tailscale vpn', 'tailscale windows fix', 'tailscale installation issues', 'tailscale service running but not connecting', 'docker desktop networking', 'hyper-v virtual network', 'windows networking problems'],
    featured: true, hasAudio: false, hasVideo: false, display: true, relatedArticles: [], readTime: 5
  },
  {
    slug: 'roku-tv-black-screen-defect-class-action-lawsuit',
    title: 'Roku TV Black Screen of Death: Class Action Investigation Into TCL Roku TV Defects',
    description: "TCL Roku TVs are failing with the \u201cblack screen of death\u201d just after warranty expires. A class action investigation is underway over the defect and Roku's controversial Terms of Service updates that block lawsuits.",
    publishedDate: '02-03-2026',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/Roku%20Class%20Action%20Lawasuit/og-roku-tv-black-screen-class-action.jpg?updatedAt=1770159135857', alt: 'Roku TV Black Screen of Death: Class Action Investigation Into TCL Roku TV Defects' },
    tags: ['Roku', 'Roku TV', 'TCL', 'Class Action', 'Consumer Rights', 'Electronics', 'TV Defect', 'Technology', 'Legal'],
    category: 'Technology',
    metaDescription: "TCL Roku TVs are failing with black screen defects 18-24 months after purchase. Learn about the class action investigation, Roku's controversial Terms of Service, and what you can do if your Roku TV has the black screen of death.",
    metaKeywords: ['roku', 'tv roku', 'roku tv', 'roku remote', 'my roku', 'roku app', 'roku channel', 'roku stick', 'roku customer service', 'roku free hdmi extender', 'roku tv black screen', 'roku black screen of death', 'tcl roku tv defect', 'roku tv not working', 'roku class action lawsuit', 'roku tv class action', 'tcl tv problems', 'roku tv black screen with sound', 'roku tv warranty', 'roku terms of service', 'roku arbitration clause', 'defective roku tv', 'roku tv repair', 'tcl roku tv recall'],
    featured: true, hasAudio: false, hasVideo: false, display: true,
    relatedArticles: ['i-built-a-roku-compatibility-checker', 'wordpress-vs-angular-why-i-built-my-site-with-zero-backend', 'the-invisible-door-how-noise-cancelling-headphones-saved-my-programming-career'],
    readTime: 5
  },
  {
    slug: 'pensacola-mexican-food-trucks-guide',
    title: 'The Complete Guide to Mexican Food Trucks in Pensacola, FL',
    description: "An authoritative guide to the best Mexican food trucks in Pensacola, from Taco Trolley's downtown icon to Tacos El Amigo's legendary tripas. Everything you need to know about finding authentic Mexican food trucks, quesabirria, street tacos, and the local taco truck scene.",
    publishedDate: '01-29-2026',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/Food%20Truck%20Post%20-%20Mexican/allthethings-og-image-mexican-food-truck-guide-pensacola.jpg', alt: 'The Complete Guide to Mexican Food Trucks in Pensacola, FL' },
    tags: ['Food Trucks', 'Pensacola', 'Mexican Food', 'Tacos', 'Restaurants', 'Local Business', 'Food', 'Cantonment', 'Downtown'],
    category: 'Food & Dining',
    metaDescription: 'Guide to Mexican food trucks in Pensacola. Taco trucks, quesabirria, birria tacos, and more.',
    metaKeywords: ['taco truck', 'taco food truck', 'mexican food', 'mexican food truck', 'food truck catering', 'taco truck near me', 'mexican food near me', 'taco food truck near me', 'mexican food truck near me', 'Pensacola food trucks', 'Pensacola mexican food', 'Taco Trolley Pensacola', 'Tacos El Amigo', 'Tacos La Mixteca', 'Carne Asada Darling', "Frontera's Tacos", 'The Happy Taco', 'Taqueria El G\u00fcero', "Taqueria Olgy's", "Hector's Mexican Grill", 'Mex-N-Go', 'Nicaraguan food Pensacola', 'birria tacos Pensacola', 'quesabirria', 'street tacos Pensacola', 'authentic tacos Pensacola', 'Cantonment mexican food', 'Downtown Pensacola tacos', 'Gulf Breeze food truck'],
    featured: true, hasAudio: false, hasVideo: false, display: true,
    relatedArticles: ['my-wife-and-i-have-visited-george-bistro-nearly-30-times', 'the-wild-story-of-the-gaudy-palace-on-scenic-highway', 'pensacola-bay-center-the-189-million-question-renovate-replace-or-watch-mobile-win'],
    readTime: 10
  },
  {
    slug: 'pensacola-bay-center-the-189-million-question-renovate-replace-or-watch-mobile-win',
    title: 'The $189 Million Question: Renovate, Replace, or Watch Mobile Win',
    description: "Escambia County faces a $189M decision on the Pensacola Bay Center: renovate the 40-year-old facility, build something new, or watch Mobile's $300M arena steal every major event for the next generation.",
    publishedDate: '01-26-2026',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/Pensacola%20Bay%20Center%20$180%20million%20question/og-bay-center-189-million-question-02.jpg', alt: 'The $189 Million Question: Renovate, Replace, or Watch Mobile Win' },
    tags: ['Pensacola', 'Bay Center', 'Escambia County', 'Pensacon', 'Local News', 'Politics', 'Infrastructure', 'Mobile', 'Development'],
    category: 'Amateur Sleuthing',
    metaDescription: "Escambia County's $189M Bay Center proposal examined: renovate, replace, or lose ground to Mobile?",
    metaKeywords: ['Pensacola Bay Center', 'Bay Center renovation', 'Pensacola', 'Escambia County', 'Pensacon', 'Mobile civic center', 'Tourist Development Tax', 'TDT funds', 'Bay Center feasibility study', 'Pensacola Ice Flyers', 'Downtown Pensacola development', 'Bay Center parking', 'Mike Kohler', 'DC Reeves'],
    featured: true, hasAudio: false, hasVideo: true, youtubeVideoId: 'HxkslyU9_2E', display: true,
    relatedArticles: ['pensacon-responds-inside-the-uphill-battle-to-save-pensacolas-biggest-convention', 'why-pensacon-has-gone-downhill', 'when-snowflakes-land-on-the-sunshine-state-pensacola-braces-for-another-unlikely-winter'],
    readTime: 14
  },
  {
    slug: 'birthday-freebies-guide-100-deals',
    title: 'Birthday Freebies: The Last Socially Acceptable Bribe (100+ Freebies)',
    description: "Your birthday is basically a loyalty checkpoint. Here's a curated, practical guide to the best birthday freebies and discounts across food, retail, entertainment, and local city lists \u2014 plus how to claim them.",
    publishedDate: '01-25-2026',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/Birthday%20Freebies/og-image-borthday-freebies-list.jpg', alt: 'Birthday Freebies Guide: 100+ Deals for Food, Retail, and Entertainment' },
    tags: ['Freebies', 'Deals', 'Coupons', 'Food', 'Restaurants', 'Retail', 'Entertainment', 'Loyalty Programs', 'Guides', 'Lists'],
    category: 'Guides',
    metaDescription: 'Guide to birthday freebies from 100+ brands: food, drinks, retail perks, and city-specific lists.',
    metaKeywords: ['birthday freebies', 'birthday rewards', 'free birthday food', 'birthday deals', 'birthday discounts', 'free birthday coffee', 'birthday coupons', 'restaurant birthday freebies', 'retail birthday rewards', 'sephora birthday gift', 'ulta birthday gift', 'starbucks birthday reward', 'amc birthday popcorn', 'local birthday freebies', 'how to get birthday freebies'],
    featured: true, hasAudio: false, display: true,
    relatedArticles: ['photo-filter-studio-tutorial', 'gradient-generator-tutorial-css-gradients', 'how-to-use-social-media-launchpad-copy-paste-launch'],
    readTime: 9
  },
  {
    slug: 'photo-filter-studio-tutorial',
    title: 'Photo Filter Studio Tutorial: Filter Photos Like a Pro',
    description: 'The Photo Filter Studio tutorial shows you how to apply professional filters, adjust brightness and contrast, and download edited photos - all in your web browser.',
    publishedDate: '01-25-2026',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/Photo-filter-studio-tutorial/og-photo-filter-studio-2.jpg', alt: 'Photo Filter Studio Tutorial: Edit Photos Like a Pro' },
    tags: ['Photo Editing', 'Image Tools', 'Design', 'Tools', 'Tutorial', 'Filters', 'Privacy'],
    category: 'Tutorials',
    metaDescription: 'Edit photos with professional filters using Photo Filter Studio. Apply presets, fine-tune, download.',
    metaKeywords: ['Photo editor', 'Photo filter studio tutorial', 'Image editing tool', 'Photo filters', 'Online photo editor', 'Browser photo editor', 'Privacy photo editing', 'Client-side photo editing', 'Photo adjustment sliders', 'Free photo editor', 'Photo editing tutorial'],
    featured: true, hasAudio: false, display: true,
    relatedArticles: ['gradient-generator-tutorial-css-gradients', 'how-to-use-social-media-launchpad-copy-paste-launch', 'base-number-converter-tutorial'],
    readTime: 4
  },
  {
    slug: 'gradient-generator-tutorial-css-gradients',
    title: 'Gradient Generator Tutorial: Create Beautiful CSS Gradients',
    description: 'Stop guessing at gradient syntax. The Gradient Generator tutorial on All The Tools gives you instant visual feedback, perfect color control, and clean CSS output - no reloading, no trial and error, no headaches.',
    publishedDate: '01-25-2026',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/Gradient%20Generator%20Tutorial/og-gradient-generator-tutorial.jpg', alt: 'Gradient Generator Tutorial: Create Beautiful CSS Gradients' },
    tags: ['CSS', 'Web Development', 'Design', 'Tools', 'Tutorial', 'Gradients', 'Frontend'],
    category: 'Tutorials',
    metaDescription: 'Create CSS gradients with ease. Pick colors, adjust angles, preview live, and copy ready-to-use code.',
    metaKeywords: ['CSS gradient generator', 'Gradient generator tutorial', 'Linear gradient CSS', 'Radial gradient', 'Conic gradient', 'CSS gradient tool', 'Gradient maker', 'CSS color gradients', 'Web design gradients', 'Gradient tutorial', 'CSS background gradient', 'Visual gradient editor', 'Gradient CSS code'],
    featured: true, hasAudio: false, display: true,
    relatedArticles: ['how-to-use-social-media-launchpad-copy-paste-launch', 'blog-components-showcase', 'one-man-one-pc-cinema-quality-starships-howard-day'],
    readTime: 4
  },
  {
    slug: 'how-to-use-social-media-launchpad-copy-paste-launch',
    title: 'How to Use Social Media Launchpad: Copy, Paste, Launch Your Social Media Posts',
    description: 'Tired of juggling fourteen tabs just to post the same update across social networks? The Social Media Launchpad on All The Tools lets you compose once and launch everywhere - with zero tracking and character counters for every platform.',
    publishedDate: '01-23-2026',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/Social%20Media%20Launchpad/og-social-media-post-composer.jpg?updatedAt=1769182782362', alt: 'How to Use Social Media Launchpad: Copy, Paste, Launch Your Social Media Posts' },
    tags: ['Social Media', 'Tools', 'Productivity', 'Privacy', 'Tutorial', 'Web Tools'],
    category: 'Tutorials',
    metaDescription: 'Use Social Media Launchpad to compose once and post everywhere with character counters and hashtags.',
    metaKeywords: ['Social media launchpad', 'Social media posting tool', 'Multi-platform social media', 'Post to multiple social networks', 'Social media composer', 'Privacy-first social media', 'Character counter tool', 'Hashtag recommendations', 'Social media productivity', 'Cross-platform posting', 'Twitter character counter', 'LinkedIn post length', 'Instagram hashtags'],
    featured: true, hasAudio: false, display: true,
    relatedArticles: ['one-man-one-pc-cinema-quality-starships-howard-day', 'blog-components-showcase', 'wordpress-vs-angular-why-i-built-my-site-with-zero-backend'],
    readTime: 3
  },
  {
    slug: 'exploding-trees-in-winter-what-causes-the-loud-cracks',
    title: "Exploding Trees in Winter: What's Behind the Loud Cracks During Extreme Cold",
    description: "Exploding trees in winter are real - frost cracking causes loud gunshot-like sounds when frozen sap expands inside tree trunks during extreme cold. Here's the science behind this startling winter phenomenon.",
    publishedDate: '01-22-2026',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/Exploding%20trees%20in%20winter/og-exploding-trees-in-winter.jpg', alt: "Exploding Trees in Winter: What's Behind the Loud Cracks During Extreme Cold" },
    tags: ['Weather', 'Winter', 'Science', 'Nature', 'Climate', 'Trees', 'Frost Cracking'],
    category: 'Natural Science',
    metaDescription: 'Can trees explode in winter? Learn about frost cracking and the gunshot sounds during extreme cold.',
    metaKeywords: ['Exploding trees in winter', 'Frost cracking', 'Trees cracking in cold', 'Why do trees explode in winter', 'Tree frost damage', 'Winter tree sounds', 'Frozen sap expansion', 'Tree gunshot sounds', 'Arctic blast tree damage', 'Extreme cold weather', 'Tree splitting winter', 'Frost crack trees'],
    featured: true, hasAudio: false, hasVideo: true, youtubeVideoId: 'Q258I2KVGzU', display: true,
    relatedArticles: ['when-snowflakes-land-on-the-sunshine-state-pensacola-braces-for-another-unlikely-winter', 'pensacola-snow-second-year', 'why-truckers-drift-to-the-right-on-the-highway'],
    readTime: 4
  },
  {
    slug: 'masters-of-the-universe-2026-he-man-returns-to-the-big-screen',
    title: 'Masters of the Universe 2026: He-Man Returns to the Big Screen',
    description: 'Nearly four decades after He-Man first burst into our lives, Masters of the Universe returns to theaters. From Saturday morning cartoons to blockbuster cinema, the most powerful man in the universe is finally returning to the big screen.',
    publishedDate: '01-22-2026',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/Masters%20of%20the%20universe%202026/og-masters-of-the-universe-he-man-returns.jpg', alt: 'Masters of the Universe 2026: He-Man Returns to the Big Screen' },
    tags: ['He-Man', 'Masters of the Universe', 'Movies', '80s Nostalgia', 'Action', 'Fantasy', 'Travis Knight'],
    category: 'TV & Film',
    metaDescription: 'He-Man returns to the big screen in 2026. A nostalgic look from Saturday cartoons to the new film.',
    metaKeywords: ['He-Man', 'Masters of the Universe', 'Masters of the Universe 2026', 'Nicholas Galitzine', 'Jared Leto Skeletor', 'Idris Elba Man-At-Arms', 'Camila Mendes Teela', 'Travis Knight', 'Amazon MGM Studios', 'Mattel', '80s cartoons', 'Castle Grayskull', 'Battle Cat', 'Eternia', 'I have the power', 'By the power of Grayskull'],
    featured: true, hasAudio: false, hasVideo: true, youtubeVideoId: 'e77HgHWjtoI', display: true,
    relatedArticles: ['when-nicholas-cage-made-a-better-five-nights-at-freddys-movie-than-five-nights-at-freddys', 'the-top-ten-worst-movie-remakes', 'when-your-monster-becomes-your-friend-how-badlands-demystifies-the-yautja'],
    readTime: 4
  },
  {
    slug: 'snow-globe-shake-demo',
    title: 'Pixel Art Fantasy Castle Snowglobe Shake Demo',
    description: 'A minimal demo post that showcases my interactive Pixel Art Snowglobe. Click/tap to select the snowglobe and give it a shake!',
    publishedDate: '01-21-2026',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/Snow%20globe%20shake%20demo/og-snow-globe-shake-demo.jpg', alt: 'Snow Globe Shake demo' },
    tags: ['Art', 'Interactive', 'Demo', 'Snow Globe'],
    category: 'Art',
    metaDescription: 'Watch the Snow Globe Shake component in action in this minimal demo post.',
    metaKeywords: ['snow globe', 'snowglobe', 'interactive art', 'canvas demo', 'matter.js'],
    featured: false, hasAudio: false, display: true, relatedArticles: [], readTime: 3
  },
  {
    slug: 'the-16-wealthiest-criminals-of-the-last-100-years',
    title: 'The 16 Wealthiest Criminals of the Last 100 Years',
    description: "From Bernie Madoff's $64.8 billion Ponzi scheme to Pablo Escobar's drug empire, these criminals amassed unimaginable wealth through fraud, drugs, and corruption.",
    publishedDate: '01-20-2026',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/The%2016%20wealthiest%20criminals%20of%20the%20last%20100%20years/allthethings-the-16-wealthiest-criminals.jpg', alt: 'The 16 Wealthiest Criminals of the Last 100 Years' },
    tags: ['True Crime', 'History', 'Finance', 'Crime', 'Biography', 'PabloEscabar'],
    category: 'Amateur Sleuthing',
    metaDescription: "The 16 wealthiest criminals of the last century, from Madoff's Ponzi scheme to Escobar's empire.",
    metaKeywords: ['Bernie Madoff', 'Pablo Escobar', 'Al Capone', 'Ponzi scheme', 'Wealthiest criminals', 'True crime', 'Financial fraud', 'Drug cartels', 'Organized crime', 'Criminal history'],
    featured: true, hasAudio: false, display: true, relatedArticles: [], readTime: 15
  },
  {
    slug: 'base-number-converter-tutorial',
    title: 'Base Number Converter Tutorial: How to Convert Between Binary, Octal, Decimal, and Hex',
    description: 'A straightforward tutorial for converting between binary, octal, decimal, and hexadecimal number systems using our free browser-based converter.',
    publishedDate: '01-19-2026',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/Base%20number%20converter%20tutorial/base-number-converter-tutorial.jpg', alt: 'Base Number Converter Tool Guide' },
    tags: ['Tools', 'Tutorials', 'Programming', 'Web Development', 'Computer Science'],
    category: 'Tutorials',
    metaDescription: 'Convert between binary, octal, decimal, and hex with our free base number converter tool.',
    metaKeywords: ['base number converter', 'binary to decimal', 'hex to decimal', 'octal converter', 'number system converter', 'binary calculator', 'hexadecimal converter'],
    featured: false, hasAudio: false, display: true, relatedArticles: [], readTime: 8
  },
  {
    slug: 'blog-components-showcase',
    title: 'Blog Components Showcase - Developer Reference',
    description: 'A comprehensive showcase of all available blog components with JSON examples for easy reference.',
    publishedDate: '01-19-2026',
    heroImage: { src: 'https://placehold.co/1200x630/1a1f35/00d9ff?text=Component+Showcase', alt: 'Blog Components Showcase' },
    tags: ['Documentation', 'Reference', 'Components'],
    category: 'Documentation',
    metaDescription: 'Complete reference guide for all blog components available in the system.',
    metaKeywords: ['blog components', 'documentation', 'reference', 'examples'],
    featured: false, hasAudio: false, display: false, relatedArticles: [], readTime: 3
  },
  {
    slug: 'one-man-one-pc-cinema-quality-starships-howard-day',
    title: "One Man, One PC, Cinema-Quality Starships: The Remarkable Work of Howard Day",
    description: "Howard Day creates cinema-quality starship renders from his home PC that rival big-budget studio productions. His Star Trek and Star Wars CGI work is so impressive, some people think it's AI-generated.",
    publishedDate: '01-18-2026',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/The%20Remarkable%20Work%20of%20Howard%20Day/cinema-quality-starships-howard-day.jpg?updatedAt=1768758216339', alt: 'Cinema-quality starship render by Howard Day' },
    tags: ['CGI', '3D Art', 'Star Trek', 'Star Wars', 'Digital Art', 'VFX', 'Fan Art'],
    category: '3D RENDERING',
    metaDescription: 'Howard Day creates cinema-quality Star Trek and Star Wars starship renders from his home PC.',
    metaKeywords: ['Howard Day', 'Howie Day', 'Star Trek CGI', 'Star Wars CGI', '3D starships', 'Cinema quality renders', '3ds Max', 'V-Ray rendering', 'Starship animation', 'Fan art', 'Digital art', 'VFX artist'],
    featured: true, hasAudio: false, display: true, relatedArticles: [], readTime: 6
  },
  {
    slug: 'pensacola-snow-second-year',
    title: 'It Happened Again: Pensacola Wakes Up to Snow for the Second January in a Row',
    description: "Pensacola gets snow for the second consecutive January, though this year's light dusting was far more modest than 2025's historic 7.6-inch dump.",
    publishedDate: '01-18-2026',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/Pensacola%20Wakes%20Up%20to%20Snow%20for%20the%20Second%20January%20in%20a%20Row/pensacola-wakes-up-to-snow-for-the-second-january-in-a-row.jpg', alt: 'It Happened Again: Pensacola Wakes Up to Snow for the Second January in a Row' },
    tags: ['Pensacola', 'Weather', 'Florida', 'Snow', 'Climate', 'Polar Vortex'],
    category: 'Amateur Sleuthing',
    metaDescription: 'Pensacola sees snow for the second January in a row. A rare event for the Florida Panhandle.',
    metaKeywords: ['Pensacola snow 2026', 'Florida snow January 2026', 'Pensacola weather', 'Florida winter storm', 'Arctic blast Florida', 'Second consecutive January snow', 'Climate change Florida', 'Florida panhandle snow', 'Unusual weather Florida', 'Pensacola Beach snow'],
    featured: true, hasAudio: false, display: true,
    relatedArticles: ['when-snowflakes-land-on-the-sunshine-state-pensacola-braces-for-another-unlikely-winter', 'why-pensacon-has-gone-downhill', 'pensacon-responds-inside-the-uphill-battle-to-save-pensacolas-biggest-convention'],
    readTime: 5
  },
  {
    slug: 'when-snowflakes-land-on-the-sunshine-state-pensacola-braces-for-another-unlikely-winter',
    title: 'When Snow Falls on the Sunshine State: Pensacola Braces for Another Unlikely Winter',
    description: 'Pensacola recorded 8.9 inches of snow last January, shattering a 130-year record. Now the Florida panhandle might see snow again. Here\'s why the polar vortex keeps sending Arctic air to the Sunshine State.',
    publishedDate: '01-18-2026',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/Pensacola%20Braces%20for%20Another%20Unlikely%20Winter/og-pensacola-snow.jpg', alt: 'When Snowflakes Land on the Sunshine State: Pensacola Braces for Another Unlikely Winter' },
    tags: ['Pensacola', 'Weather', 'Florida', 'Snow', 'Climate', 'Polar Vortex'],
    category: 'Amateur Sleuthing',
    metaDescription: 'Pensacola broke a 130-year snow record last January. The polar vortex may bring more snow.',
    metaKeywords: ['Pensacola snow', 'Florida snow', 'Polar vortex', 'Pensacola weather', 'Florida winter storm', 'Arctic blast Florida', 'Pensacola January 2025', 'Climate change Florida', 'Florida panhandle snow', 'Unusual weather Florida'],
    featured: true, hasAudio: false, display: true,
    relatedArticles: ['why-pensacon-has-gone-downhill', 'pensacon-responds-inside-the-uphill-battle-to-save-pensacolas-biggest-convention', 'the-wild-story-of-the-gaudy-palace-on-scenic-highway'],
    readTime: 4
  },
  {
    slug: 'how-to-use-the-barcode-scanner-tool',
    title: 'How to Use the Barcode Scanner Tool: Complete Guide',
    description: 'Learn how to scan product barcodes using your phone or computer camera with our free barcode scanner. Step-by-step instructions, tips for best results, and everything you need to know.',
    publishedDate: '01-17-2026',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/How%20to%20Use%20the%20Barcode%20Scanner%20Tool/og-barcode-scanner-guide.jpg', alt: 'How to Use the Barcode Scanner Tool: Complete Guide' },
    tags: ['Barcode Scanner', 'Tools', 'How-To', 'Tutorial', 'UPC', 'EAN', 'Productivity'],
    category: 'Tutorials',
    metaDescription: 'Guide to the free barcode scanner. Scan UPC, EAN, Code 128, and QR codes with your camera.',
    metaKeywords: ['Barcode scanner tutorial', 'How to scan barcodes', 'UPC scanner guide', 'EAN scanner tutorial', 'Barcode reader how-to', 'Product scanner guide', 'QR code scanner', 'Code 128 scanner', 'Mobile barcode scanning', 'Inventory scanning', 'Free barcode tool'],
    featured: true, hasAudio: false, display: true,
    relatedArticles: ['stop-typing-in-those-tiny-on-reward-codes-by-hand', 'i-built-a-roku-compatibility-checker', 'wordpress-vs-angular-why-i-built-my-site-with-zero-backend'],
    readTime: 6
  },
  {
    slug: 'when-your-monster-becomes-your-friend-how-badlands-demystifies-the-yautja',
    title: 'When Your Monster Becomes A Friend: How Badlands Demystifies the Yautja',
    description: "Badlands trades the Predator's unknowable terror for something more human. This is a look at what the film gains - and what it loses - when the monster starts talking.",
    publishedDate: '01-15-2026',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/How%20Badlands%20Demystifies%20the%20Yautja/how-badlands-demystifies-the-yautja.jpg', alt: 'When Your Monster Becomes Your Friend: How Badlands Demystifies the Yautja' },
    tags: ['Predator', 'Badlands', 'Yautja', 'Science Fiction', 'Film Analysis', 'Alien', 'SciFi'],
    category: 'TV & Film',
    metaDescription: 'Badlands gives the Predator a voice and a soul. An analysis of how the film reframes the Yautja and why the mystery still mattered.',
    metaKeywords: ['Badlands', 'Predator franchise', 'Yautja', 'Predator analysis', 'Weyland-Yutani', 'Alien universe', 'Science fiction film', 'Movie critique'],
    featured: true, hasAudio: false, display: true,
    relatedArticles: ['when-nicholas-cage-made-a-better-five-nights-at-freddys-movie-than-five-nights-at-freddys', 'we-need-to-talk-about-that-wormhole-scene-in-interstellar', 'the-deneb-paradox-when-first-contact-means-last-contact'],
    readTime: 5
  },
  {
    slug: 'the-silent-502-solving-internal-proxy-conflicts-in-self-hosted-postiz',
    title: 'The "Silent 502": Solving Internal Proxy Conflicts in Self-Hosted Postiz',
    description: 'Self-hosting Postiz behind Caddy and Cloudflare? Learn how to fix 502 Bad Gateway errors caused by internal loopback issues with Docker networking.',
    publishedDate: '01-14-2026',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/Solving%20Internal%20Proxy%20Conflicts%20in%20Self-Hosted%20Postiz/og-postiz-502-error.jpg', alt: 'Fixing 502 Bad Gateway errors in self-hosted Postiz with Docker and reverse proxy' },
    tags: ['Docker', 'Self-Hosting', 'Postiz', 'DevOps', 'Networking', 'Troubleshooting'],
    category: 'Technology',
    metaDescription: 'Fix 502 Bad Gateway errors in self-hosted Postiz. Learn how to solve internal loopback problems when running Docker containers behind Caddy and Cloudflare.',
    metaKeywords: ['Postiz 502 error', 'Self-hosting Postiz', 'Docker networking', 'Reverse proxy configuration', 'Caddy proxy', 'Cloudflare CDN', 'Internal loopback', 'Docker container networking', 'Prisma database sync', 'NestJS backend', 'Next.js frontend', 'Proxy trust headers'],
    featured: true, hasAudio: false, display: true,
    relatedArticles: ['wordpress-vs-angular-why-i-built-my-site-with-zero-backend', 'stop-typing-in-those-tiny-on-reward-codes-by-hand', 'the-wild-story-of-the-gaudy-palace-on-scenic-highway'],
    readTime: 2
  },
  {
    slug: 'stop-typing-in-those-tiny-on-reward-codes-by-hand',
    title: 'How to Scan Reward Codes: Stop Typing Tiny Codes by Hand',
    description: 'Tired of typing in tiny alphanumeric codes from On! brand nicotine boxes? Use our free scanning tool to instantly capture reward codes using your camera.',
    publishedDate: '01-13-2026',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/How%20to%20Scan%20Reward%20Codes:%20Stop%20Typing%20Tiny%20Codes%20by%20Hand/og-on-reward-scanner-blog-post.jpg', alt: 'How to Scan Reward Codes: Stop Typing Tiny Codes by Hand' },
    tags: ['On! Rewards', 'OCR', 'Tools', 'Productivity', 'Mobile', 'Privacy'],
    category: 'Tutorials',
    metaDescription: 'Tired of typing in tiny alphanumeric codes from On! brand nicotine boxes? Use our free scanning tool to instantly capture reward codes using your camera.',
    metaKeywords: ['On! rewards', 'On! reward codes', 'On! nicotine pouches', 'Reward code scanner', 'OCR scanner', 'Code scanner tool', 'On! app', 'Free OCR tool', 'Browser OCR', 'Mobile scanner', 'Privacy tools', 'Local processing'],
    featured: true, hasAudio: false, display: true,
    relatedArticles: ['i-built-a-roku-compatibility-checker', 'wordpress-vs-angular-why-i-built-my-site-with-zero-backend', 'the-invisible-door-how-noise-cancelling-headphones-saved-my-programming-career'],
    readTime: 4
  },
  {
    slug: 'lighthuggers-when-fan-art-captures-the-impossible',
    title: "LIGHTHUGGERS: Fan Art Captures Alastair Reynolds' \"Revelation Space\"",
    description: "Alastair Reynolds's Revelation Space lighthuggers are magnificent, terrifying vessels that take months just to reach cruising velocity.",
    publishedDate: '01-06-2026',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/Fan%20Art%20Captures%20Alastair%20Reynolds%20Revelation%20Space/og-lighthuggers-fan-art.jpg', alt: 'LIGHTHUGGERS: When Fan Art Captures the Impossible' },
    tags: ['Revelation Space', 'Alastair Reynolds', 'Science Fiction', 'Fan Art', 'Lighthuggers', 'Concept Art'],
    category: 'Books & Literature',
    metaDescription: "Fan art of Alastair Reynolds's lighthuggers from Revelation Space by Zandoarts, Tomioka, and more.",
    metaKeywords: ['Lighthuggers', 'Revelation Space', 'Alastair Reynolds', 'Nostalgia for Infinity', 'Redemption Ark', 'Absolution Gap', 'Science fiction art', 'Concept art', 'Fan art', 'Space opera', 'Hard science fiction', 'Revelation Space art'],
    featured: true, hasAudio: false, display: true,
    relatedArticles: ['we-need-to-talk-about-that-wormhole-scene-in-interstellar', 'c-beams-the-top-down-space-action-rpg-that-gets-it', 'when-nicholas-cage-made-a-better-five-nights-at-freddys-movie-than-five-nights-at-freddys'],
    readTime: 9
  },
  {
    slug: 'pensacon-responds-inside-the-uphill-battle-to-save-pensacolas-biggest-convention',
    title: "Pensacon Responds: Inside the Uphill Battle to Save Pensacola's Biggest Convention",
    description: "After a critical article about Pensacon went viral, something unexpected happened: Julio Diaz, Pensacon's media director, showed up on Reddit for an impromptu AMA. What followed was a rare glimpse into the challenges of running Pensacola's largest convention.",
    publishedDate: '01-05-2026',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/Pensacon%20Responds/og-pensacon-responds.jpg', alt: "Pensacon Responds: Inside the Uphill Battle to Save Pensacola's Biggest Convention" },
    tags: ['Pensacon', 'Pensacola', 'Conventions', 'Events', 'Local News', 'Community', 'Reddit'],
    category: 'Amateur Sleuthing',
    metaDescription: "Pensacon's Julio Diaz addresses venue issues and scheduling failures in an impromptu Reddit AMA.",
    metaKeywords: ['Pensacon', 'Pensacon 2026', 'Julio Diaz Pensacon', 'Pensacola Bay Center', 'Pensacola conventions', 'Comic con Pensacola', 'Pensacon response', 'Pensacola events', 'Convention management', 'Reddit AMA'],
    featured: true, hasAudio: false, display: true,
    relatedArticles: ['why-pensacon-has-gone-downhill', 'kenyas-tech-scene-how-a-bunch-of-developers-built-stuff-that-changed-the-world', 'the-wild-story-of-the-gaudy-palace-on-scenic-highway'],
    readTime: 8
  },
  {
    slug: 'why-pensacon-has-gone-downhill',
    title: 'Why Pensacon Has Gone Downhill - And What Can Be Done About It',
    description: "After seven years of attending Pensacon, it's time to talk about what's broken. From venue issues to communication failures, here's an honest look at how Pensacola's beloved convention is struggling, and what needs to change.",
    publishedDate: '01-04-2026',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/Why%20Pensacon%20Has%20Gone%20Downhill/og-why-pensacon-has-gone-downhill.jpg', alt: 'Why Pensacon Has Gone Downhill - And What Can Be Done About It' },
    tags: ['Pensacon', 'Pensacola', 'Conventions', 'Events', 'Local News', 'Community'],
    category: 'Amateur Sleuthing',
    metaDescription: "Pensacon's problems examined: venue overcrowding, scheduling disasters, and communication failures.",
    metaKeywords: ['Pensacon', 'Pensacon problems', 'Pensacola Bay Center', 'Pensacola conventions', 'Comic con Pensacola', 'Pensacon reviews', 'Pensacon issues', 'Pensacola events', 'Convention planning', 'Pensacon schedule'],
    featured: true, hasVideo: true, youtubeVideoId: 'tKVlbvXfL4c', display: true,
    relatedArticles: ['kenyas-tech-scene-how-a-bunch-of-developers-built-stuff-that-changed-the-world', 'my-wife-and-i-have-visited-george-bistro-nearly-30-times', 'the-wild-story-of-the-gaudy-palace-on-scenic-highway'],
    readTime: 8
  },
  {
    slug: 'we-need-to-talk-about-that-wormhole-scene-in-interstellar',
    title: 'We Need to Talk About That Wormhole Scene in Interstellar',
    description: "Interstellar is a masterpiece, but that one scene where Romilly explains basic wormhole theory to Cooper - a trained NASA astronaut - keeps nagging at me. Let's talk about why it doesn't quite work.",
    publishedDate: '01-03-2026',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/That%20Wormhole%20Scene%20in%20Interstellar/og-interstellar-wormhole-scene.jpg', alt: 'We Need to Talk About That Wormhole Scene in Interstellar' },
    tags: ['Interstellar', 'Christopher Nolan', 'Science Fiction', 'Movie Analysis', 'Film Critique'],
    category: 'TV & Film',
    metaDescription: "Why does Romilly explain basic physics to a NASA astronaut? Analyzing Interstellar's exposition.",
    metaKeywords: ['Interstellar', 'Interstellar wormhole scene', 'Christopher Nolan', 'Movie critique', 'Film analysis', 'Interstellar review', 'Science fiction movies', 'Movie plot holes', 'Kip Thorne', 'Wormhole theory'],
    featured: true, hasAudio: false, display: true,
    relatedArticles: ['c-beams-the-top-down-space-action-rpg-that-gets-it', 'the-deneb-paradox-when-first-contact-means-last-contact', 'when-nicholas-cage-made-a-better-five-nights-at-freddys-movie-than-five-nights-at-freddys'],
    readTime: 4
  },
  {
    slug: 'how-to-sell-your-timber-for-top-dollar-in-ohio',
    title: 'How to Sell Your Timber for Top Dollar in Ohio',
    description: 'Selling timber is a major financial decision for southeast Ohio landowners. Learn the structured, transparent process that eliminates guesswork and consistently delivers top market value through competitive bidding and professional oversight.',
    publishedDate: '01-03-2026',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/How%20to%20Sell%20Your%20Timber%20for%20Top%20Dollar%20in%20Ohio/og-how-to-sell-timber-ohio.jpg', alt: 'How to Sell Your Timber for Top Dollar in Ohio' },
    tags: ['Timber Sales', 'Ohio', 'Forestry', 'Land Management', 'Timber Buyers', 'Southeast Ohio'],
    category: 'Amateur Sleuthing',
    metaDescription: 'Get maximum value from timber sales in southeast Ohio with professional forestry consultation.',
    metaKeywords: ['Timber sales Ohio', 'Sell timber southeast Ohio', 'Timber buyers Ohio', 'Forestry consultation', 'Timber harvest', 'Land management Ohio', 'Timber value', 'Good Faith Timber Buyers', 'Professional forestry', 'Timber bidding'],
    featured: true, hasAudio: false, display: true,
    relatedArticles: ['the-wild-story-of-the-gaudy-palace-on-scenic-highway', 'why-truckers-drift-to-the-right-on-the-highway', 'my-wife-and-i-have-visited-george-bistro-nearly-30-times'],
    readTime: 3
  },
  {
    slug: 'c-beams-the-top-down-space-action-rpg-that-gets-it',
    title: 'C-Beams: The Top-Down Space Action RPG That Gets It',
    description: 'A deep dive into C-Beams, an upcoming top-down space action RPG that understands what makes the genre tick. From subsystem targeting to meaningful exploration, this one\'s worth watching.',
    publishedDate: '01-02-2026',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/C-Beams%20The%20Top-Down%20Space%20Action%20RPG/og-c-beams-the-space-action-rpg-that-gets-it.jpg', alt: 'C-Beams: The Top-Down Space Action RPG That Gets It' },
    tags: ['Gaming', 'C-Beams', 'Space RPG', 'Top-Down Shooter', 'Indie Games', 'LevelCap'],
    category: 'Gaming',
    metaDescription: 'A deep dive into C-Beams, an upcoming top-down space action RPG from Distant Light Games. Why this indie space shooter is worth paying attention to.',
    metaKeywords: ['C-Beams', 'Space RPG', 'Top-down space game', 'Distant Light Games', 'LevelCap', 'Space action RPG', 'Indie games', 'Space exploration', 'Gaming preview'],
    featured: true, hasAudio: false, hasVideo: true, youtubeVideoId: 'iG5BPhzmKuo', display: true,
    relatedArticles: [], readTime: 4
  },
  {
    slug: 'the-top-ten-worst-movie-remakes',
    title: 'The Top Ten Worst Movie Remakes',
    description: "Hollywood loves a remake, but sometimes they get it spectacularly wrong. From Total Recall to The Crow, here's a breakdown of the ten worst remakes that completely missed the point of what made the originals work.",
    publishedDate: '01-02-2026',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/The%20Top%20Ten%20Worst%20Movie%20Remakes/og-worst-movie-remakes.jpg', alt: 'The Top Ten Worst Movie Remakes' },
    tags: ['Movies', 'Remakes', 'Total Recall', 'The Crow', 'Film Analysis', 'Bad Movies'],
    category: 'TV & Film',
    metaDescription: 'Hollywood loves a remake, but sometimes they get it spectacularly wrong. A breakdown of the ten worst movie remakes that completely missed the point.',
    metaKeywords: ['Movie remakes', 'Worst remakes', 'Bad remakes', 'Total Recall', 'The Crow', 'Hellboy', 'Film analysis', 'Hollywood remakes', 'Failed remakes'],
    featured: true, display: true,
    relatedArticles: ['when-nicholas-cage-made-a-better-five-nights-at-freddys-movie-than-five-nights-at-freddys', 'these-song-lyrics-do-not-tease-the-grinch-they-unload-on-him', 'the-deneb-paradox-when-first-contact-means-last-contact'],
    readTime: 10
  },
  {
    slug: 'kenyas-tech-scene-how-a-bunch-of-developers-built-stuff-that-changed-the-world',
    title: "Kenya's Tech Scene: How a Bunch of Developers Built Stuff That Changed the World",
    description: "From Ushahidi's crisis mapping to M-Pesa's mobile banking revolution, Kenya's tech ecosystem has quietly produced some of the most consequential digital tools of the last two decades. Here's the story nobody talks about.",
    publishedDate: '01-01-2026',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/Kenyas%20Tech%20Scene/og-kenya-tech-scene.jpg', alt: "Kenya's Tech Scene: How Developers Changed the World" },
    tags: ['Kenya', 'Technology', 'M-Pesa', 'Ushahidi', 'African Tech', 'Innovation'],
    category: 'Technology',
    metaDescription: "From Ushahidi to M-Pesa, how Kenya's developers built digital tools that changed the world.",
    metaKeywords: ['Kenya tech scene', 'Ushahidi', 'M-Pesa', 'iHub Nairobi', 'BRCK', 'African technology', 'Silicon Savannah', 'Kenyan startups', 'Mobile banking', 'Crisis mapping'],
    featured: true, hasAudio: false, display: true,
    relatedArticles: ['the-invisible-door-how-noise-cancelling-headphones-saved-my-programming-career', 'wordpress-vs-angular-why-i-built-my-site-with-zero-backend', 'i-built-a-roku-compatibility-checker'],
    readTime: 5
  },
  {
    slug: 'when-nicholas-cage-made-a-better-five-nights-at-freddys-movie-than-five-nights-at-freddys',
    title: "When Nicholas Cage Made a Better Five Nights at Freddy's Movie Than Five Nights at Freddy's",
    description: "Why Willy's Wonderland remains the killer animatronic movie we actually deserved - a deep dive into how Nicolas Cage fighting possessed Chuck E. Cheese knockoffs delivered more than the official FNAF adaptation.",
    publishedDate: '12-31-2025',
    heroImage: { src: "https://ik.imagekit.io/allthethingsdev/When%20Nicholas%20Cage%20made%20a%20better%20FNAF%20movie%20than%20FNAF/og-willys-wonderland-better-than-fnaf.jpg", alt: "When Nicholas Cage Made a Better Five Nights at Freddy's Movie" },
    tags: ["Willy's Wonderland", "Five Nights at Freddy's", 'Nicolas Cage', 'Horror', 'Movie Review'],
    category: 'TV & Film',
    metaDescription: "Why Willy's Wonderland is a better killer animatronic movie than the official FNAF adaptation.",
    metaKeywords: ["Willy's Wonderland", "Five Nights at Freddy's", 'FNAF movie', 'Nicolas Cage', 'Horror movie review', 'Killer animatronics', 'B-movie', 'Cult classic'],
    featured: true, hasAudio: false, display: true,
    relatedArticles: ['these-song-lyrics-do-not-tease-the-grinch-they-unload-on-him', 'the-deneb-paradox-when-first-contact-means-last-contact', 'the-wild-story-of-the-gaudy-palace-on-scenic-highway'],
    readTime: 8
  },
  {
    slug: 'we-remember-why-your-childhood-tv-habits-might-become-a-professional-credential',
    title: 'Why Your Childhood TV Habits Might Become a Professional Credential',
    description: 'The generation that experienced pre-AI media firsthand may become valuable authenticity verification specialists - because we have the actual neural pathways from living through it.',
    publishedDate: '12-30-2025',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/We%20remember%20childhood%20TV%20habits/og-we-remember-childhood-tv-habits.jpg', alt: 'Why Your Childhood TV Habits Might Become a Professional Credential' },
    tags: ['AI', 'Future of Work', 'Memory', 'Authenticity', 'Deepfakes'],
    category: 'Technology',
    metaDescription: 'Pre-AI media veterans may become authenticity verification specialists with real neural pathways.',
    metaKeywords: ['AI detection', 'Deepfakes', 'Authenticity verification', 'Memory', 'Future of work', 'Generative AI', 'Expert witness', 'Pattern recognition'],
    featured: true, hasAudio: false, display: true,
    relatedArticles: ['the-invisible-door-how-noise-cancelling-headphones-saved-my-programming-career', 'wordpress-vs-angular-why-i-built-my-site-with-zero-backend', 'the-deneb-paradox-when-first-contact-means-last-contact'],
    readTime: 2
  },
  {
    slug: 'the-invisible-door-how-noise-cancelling-headphones-saved-my-programming-career',
    title: 'The Invisible Door - How noise cancelling headphones saved my programming career',
    description: 'How noise cancelling headphones transformed my programming by eliminating unpredictable sounds and giving me back the ability to think deeply in a chaotic home environment.',
    publishedDate: '12-30-2025',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/The%20Invisible%20Door%20-%20Noise%20Cancelling%20Headphones/og-the-invisible-door-noise-cancelling-headphones.jpg', alt: 'The Invisible Door - How noise cancelling headphones saved my programming career' },
    tags: ['Programming', 'Productivity', 'Remote Work', 'Focus', 'Noise Cancelling Headphones'],
    category: 'Technology',
    metaDescription: 'How noise cancelling headphones restored my ability to code deeply in a chaotic home environment.',
    metaKeywords: ['Noise cancelling headphones', 'Programming productivity', 'Remote work', 'Focus', 'Work from home', 'Developer tools', 'Concentration', 'Mental stack'],
    featured: true, display: true,
    relatedArticles: ['wordpress-vs-angular-why-i-built-my-site-with-zero-backend', 'i-switched-from-facebook-to-reddit-for-doomscrolling', 'how-to-calculate-percentages-in-your-head'],
    readTime: 4
  },
  {
    slug: 'my-wife-and-i-have-visited-george-bistro-nearly-30-times',
    title: "My Wife And I Have Visited George Bistro Nearly 30 Times Over The Last Few Years. Here's Our Experience.",
    description: "After nearly 30 visits over several years, George Bistro has become our happy place. Here's an honest, detailed review of everything we've tried, from the bone marrow to the ribeye and nearly every cocktail on the menu.",
    publishedDate: '12-28-2025',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/I%20have%20visited%20George%20bistro%20nearly%2030%20times/og-georges-bistro-review.jpg', alt: 'My Wife And I Have Visited George Bistro Nearly 30 Times' },
    tags: ['Restaurant Review', 'Food', 'Fine Dining', 'Pensacola', 'George Bistro'],
    category: 'Food & Dining',
    metaDescription: 'An honest, detailed review of George Bistro after 30 visits.',
    metaKeywords: ['George Bistro', 'Pensacola restaurants', 'Fine dining', 'Restaurant review', 'Food review', 'George Bistro menu', 'Best restaurants Pensacola'],
    featured: true, display: true,
    relatedArticles: ['the-wild-story-of-the-gaudy-palace-on-scenic-highway', 'why-truckers-drift-to-the-right-on-the-highway', 'i-switched-from-facebook-to-reddit-for-doomscrolling'],
    readTime: 11
  },
  {
    slug: 'i-built-a-roku-compatibility-checker',
    title: 'I Built a Roku Compatibility Checker (And This Is Why You Might Need It)',
    description: 'After a decade of buying Rokus and struggling to find compatibility info, I spent a week compiling specs for every Roku product and built a simple web tool to solve this problem once and for all.',
    publishedDate: '12-27-2025',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/I%20built%20a%20roku%20compatibility%20checker/og-roku-compatibility-checker.jpg', alt: 'I Built a Roku Compatibility Checker' },
    tags: ['Roku', 'Tools', 'Hardware', 'Compatibility', 'Product Review'],
    category: 'Technology',
    metaDescription: 'After struggling to find Roku compatibility info, I built a web tool that shows you exactly what features and accessories work with your Roku model.',
    metaKeywords: ['Roku compatibility', 'Roku checker', 'Roku features', 'Roku accessories', 'Roku wireless speakers', 'Roku soundbar', 'Roku 4K', 'Roku HDR'],
    featured: true, display: true,
    relatedArticles: ['wordpress-vs-angular-why-i-built-my-site-with-zero-backend', 'how-to-calculate-percentages-in-your-head', 'the-wild-story-of-the-gaudy-palace-on-scenic-highway'],
    readTime: 4
  },
  {
    slug: 'these-song-lyrics-do-not-tease-the-grinch-they-unload-on-him',
    title: 'These Song Lyrics Do Not Tease the Grinch. They Unload on Him.',
    description: "A psychological breakdown of how \"You're A Mean One, Mr. Grinch\" isn't playful teasing - it's a brutal character assassination with surprising depth.",
    publishedDate: '12-24-2025',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/These%20Grinch%20lyrics%20unload%20on%20him/og-these-song-lyrics-do-not-tease-the-grinch-they-unload-on-him.jpg', alt: 'These Song Lyrics Do Not Tease the Grinch. They Unload on Him.' },
    tags: ['The Grinch', 'Psychology', 'Christmas', 'Pop Culture Analysis'],
    category: 'TV & Film',
    metaDescription: "A psychological breakdown of how \"You're A Mean One, Mr. Grinch\" isn't playful teasing - it's a brutal character assassination.",
    metaKeywords: ['Grinch', 'Mr. Grinch', 'Psychology', 'Christmas', 'Pop Culture', 'Character Analysis', 'Song Analysis'],
    featured: true, display: true,
    relatedArticles: ['the-deneb-paradox-when-first-contact-means-last-contact', 'the-wild-story-of-the-gaudy-palace-on-scenic-highway', 'i-switched-from-facebook-to-reddit-for-doomscrolling'],
    readTime: 3
  },
  {
    slug: 'the-deneb-paradox-when-first-contact-means-last-contact',
    title: 'The Deneb Paradox: When First Contact Means Last Contact',
    description: "A deep dive into Pluribus episode 8's terrifying revelation about the Deneb aliens and their galaxy-spanning plan to absorb all conscious life.",
    publishedDate: '12-21-2025',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/The%20Debeb%20paradox/og-pluribus-the-deneb-paradox-when-first-contact-means-last-contact.jpg', alt: 'The Deneb Paradox: When First Contact Means Last Contact' },
    tags: ['Pluribus', 'TV Analysis', 'Science Fiction', 'Vince Gilligan'],
    category: 'TV & Film',
    metaDescription: "A deep dive into Pluribus episode 8's terrifying revelation about the Deneb aliens and their galaxy-spanning plan to absorb all conscious life.",
    metaKeywords: ['Pluribus', 'Deneb aliens', 'TV analysis', 'Science fiction', 'Vince Gilligan', 'Hive mind', 'First contact'],
    featured: true, display: true,
    relatedArticles: ['why-truckers-drift-to-the-right-on-the-highway', 'the-wild-story-of-the-gaudy-palace-on-scenic-highway', 'i-switched-from-facebook-to-reddit-for-doomscrolling'],
    readTime: 20
  },
  {
    slug: 'how-to-calculate-percentages-in-your-head',
    title: 'How to Calculate Percentages in Your Head (Without Looking Like a Dunce)',
    description: 'Master mental math with simple tricks to calculate percentages instantly. No more fumbling with your phone calculator.',
    publishedDate: '12-21-2025',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/How%20to%20calculate%20percentages%20in%20your%20head/og-how-to-calculate-percentages-in-your-head.jpg', alt: 'How to Calculate Percentages in Your Head' },
    tags: ['Math', 'Mental Math', 'Tips', 'Life Skills'],
    category: 'Education',
    metaDescription: 'Master mental math with simple tricks to calculate percentages instantly. No more fumbling with your phone calculator.',
    metaKeywords: ['Mental Math', 'Calculate Percentages', 'Math Tricks', 'Quick Math', 'Percentage Calculation', 'Math Tips'],
    featured: true, display: true,
    relatedArticles: ['wordpress-vs-angular-why-i-built-my-site-with-zero-backend', 'i-switched-from-facebook-to-reddit-for-doomscrolling', 'why-truckers-drift-to-the-right-on-the-highway'],
    readTime: 2
  },
  {
    slug: 'why-truckers-drift-to-the-right-on-the-highway',
    title: 'Why Truckers Drift to the Right on the Highway',
    description: 'Ever wonder why semi-trucks veer toward the shoulder? The reasons are more intentional - and darker - than you think.',
    publishedDate: '12-21-2025',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/Why%20do%20truckers%20veer%20to%20the%20right/og-why-do-semi-truckers-veer-to-the-right-on-the-highway.jpg', alt: 'Why Truckers Drift to the Right on the Highway' },
    tags: ['Trucking', 'Highway Safety', 'Transportation', 'Road Safety'],
    category: 'Amateur Sleuthing',
    metaDescription: "Ever wonder why semi-trucks veer toward the shoulder? The reasons are more intentional\u2014and darker\u2014than you think.",
    metaKeywords: ['Trucking', 'Highway Safety', 'Semi-Trucks', 'Road Safety', 'Transportation', 'Driver Fatigue'],
    featured: true, display: true,
    relatedArticles: ['the-wild-story-of-the-gaudy-palace-on-scenic-highway', 'the-deneb-paradox-when-first-contact-means-last-contact', 'i-switched-from-facebook-to-reddit-for-doomscrolling'],
    readTime: 5
  },
  {
    slug: 'wordpress-vs-angular-why-i-built-my-site-with-zero-backend',
    title: 'WordPress vs. Angular: Why I Built My Site With Zero Backend',
    description: 'Why I chose Angular over WordPress to build AllTheTools.dev - complete control, zero technical debt, and no database required.',
    publishedDate: '12-06-2025',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/Wordpress%20versus%20angular/og-why-i-build-my-site-with-zero-backend.jpg', alt: 'WordPress vs. Angular: Why I Built My Site With Zero Backend' },
    tags: ['Angular', 'WordPress', 'Web Development', 'Static Sites'],
    category: 'Technology',
    metaDescription: 'Why I chose Angular over WordPress to build AllTheTools.dev - complete control, zero technical debt, and no database required.',
    metaKeywords: ['Angular', 'WordPress', 'Web Development', 'Static Sites', 'Front-End', 'CMS'],
    featured: true, display: true,
    relatedArticles: ['i-switched-from-facebook-to-reddit-for-doomscrolling', 'how-to-calculate-percentages-in-your-head', 'the-wild-story-of-the-gaudy-palace-on-scenic-highway'],
    readTime: 8
  },
  {
    slug: 'i-switched-from-facebook-to-reddit-for-doomscrolling',
    title: "I Switched from Facebook to Reddit for Doomscrolling. Here's What Happened.",
    description: 'How I broke my Facebook addiction by redirecting my doomscrolling habit to something that actually gives back.',
    publishedDate: '12-04-2025',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/I%20switched%20from%20Facebook%20to%20Reddit%20for%20doomscrolling/og-i-switched-from-facebook-to-reddit-for-doomscrolling.jpg', alt: 'I Switched from Facebook to Reddit for Doomscrolling' },
    tags: ['Social Media', 'Reddit', 'Facebook', 'Productivity'],
    category: 'Technology',
    metaDescription: 'How I broke my Facebook addiction by redirecting my doomscrolling habit to something that actually gives back.',
    metaKeywords: ['Facebook', 'Reddit', 'Doomscrolling', 'Social Media', 'Productivity'],
    featured: true, display: true,
    relatedArticles: ['wordpress-vs-angular-why-i-built-my-site-with-zero-backend', 'how-to-calculate-percentages-in-your-head', 'the-deneb-paradox-when-first-contact-means-last-contact'],
    readTime: 5
  },
  {
    slug: 'the-wild-story-of-the-gaudy-palace-on-scenic-highway',
    title: "The Taj Mahal House: The WILD Story of Pensacola's Gaudy Palace",
    description: "How the Taj Mahal House on Scenic Highway became Pensacola's most controversial golden-roofed landmark.",
    publishedDate: '12-02-2025',
    heroImage: { src: 'https://ik.imagekit.io/allthethingsdev/The%20wild%20story%20of%20the%20gaudy%20palace%20on%20scenic%20highway/og-the-wild-story-of-the-gaudy-palace.jpg', alt: "The Taj Mahal House: The WILD Story of Pensacola's Gaudy Palace on Scenic Highway" },
    tags: ['Pensacola', 'Scenic Highway', 'Taj Mahal House', 'Palace', 'Architecture'],
    category: 'Amateur Sleuthing',
    metaDescription: "The wild story of the Taj Mahal House in Pensacola - how this golden-roofed mansion on Scenic Highway became Florida's most controversial landmark.",
    metaKeywords: ['Taj Mahal House', 'Taj Mahal House Pensacola', 'Pensacola Taj Mahal', 'Scenic Highway palace', 'Pensacola golden mansion', 'Taj Mahal Pensacola Florida', 'Scenic Highway Pensacola', 'Gaudy palace Pensacola', 'Pensacola landmarks', 'Controversial mansion Pensacola', 'Golden roof house Pensacola'],
    featured: true, display: true,
    relatedArticles: ['why-truckers-drift-to-the-right-on-the-highway', 'i-switched-from-facebook-to-reddit-for-doomscrolling', 'wordpress-vs-angular-why-i-built-my-site-with-zero-backend'],
    readTime: 8
  }
];

// ── TypeScript content file evaluator ───────────────────────────────────────

/**
 * Convert see-also blocks' article IDs from numeric strings to slugs.
 */
function convertSeeAlsoIds(content) {
  if (!Array.isArray(content)) return content;
  return content.map(block => {
    if (block.type === 'see-also' && block.data && Array.isArray(block.data.items)) {
      return {
        ...block,
        data: {
          ...block.data,
          items: block.data.items.map(item => {
            if (item.type === 'article' && ID_TO_SLUG[item.id]) {
              return { ...item, id: ID_TO_SLUG[item.id] };
            }
            return item;
          })
        }
      };
    }
    return block;
  });
}

/**
 * Evaluate a TypeScript content file and return the ContentBlock[] array.
 * Strips TS-specific syntax (imports, type annotations) then uses vm.
 */
function evalContentFile(filePath) {
  let src = fs.readFileSync(filePath, 'utf-8');

  // Normalize Windows line endings so all regex can rely on \n only
  src = src.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Remove import statements
  src = src.replace(/^import\s+[^\n]+\n/gm, '');

  // Remove type annotations from variable declarations:
  //   const foo: SomeType[] = ...  =>  const foo = ...
  src = src.replace(/^(\s*(?:export\s+)?const\s+\w+)\s*:[^=\n]+=\s*/gm, '$1 = ');

  // Remove `export` keyword from declarations
  src = src.replace(/^export\s+(?=const|let|var)/gm, '');

  // Remove standalone `export type ...` lines
  src = src.replace(/^export\s+type\s+[^\n]+\n/gm, '');

  // Replace top-level const/let with var so vm.runInContext exposes them on the sandbox
  src = src.replace(/^const\s+/gm, 'var ');
  src = src.replace(/^let\s+/gm, 'var ');

  // Some content files reference AUTHORS (e.g. for author-signature blocks)
  const sandbox = {
    AUTHORS: { joel_hansen: JOEL_HANSEN }
  };
  try {
    vm.createContext(sandbox);
    vm.runInContext(src, sandbox);
  } catch (err) {
    console.error(`  \u26a0  VM eval error in ${path.basename(filePath)}: ${err.message}`);
    return null;
  }

  // Most files: `content` is a top-level array
  if (Array.isArray(sandbox.content)) {
    return sandbox.content;
  }

  // Some files: a named constant object with a `content` property
  for (const [key, val] of Object.entries(sandbox)) {
    if (val && typeof val === 'object' && !Array.isArray(val) && Array.isArray(val.content)) {
      return val.content;
    }
  }

  return null;
}

/**
 * Map from article slug to the content filename (without extension),
 * for slugs whose filename differs from the slug.
 */
const SLUG_TO_FILE = {};
for (const [file, slug] of Object.entries(FILE_TO_SLUG)) {
  SLUG_TO_FILE[slug] = file;
}

function getContentFilePath(slug) {
  const fileName = SLUG_TO_FILE[slug] || slug;
  // Try .content.ts first, then plain .ts
  const contentPath = path.join(CONTENT_DIR, `${fileName}.content.ts`);
  if (fs.existsSync(contentPath)) return contentPath;
  const plainPath = path.join(CONTENT_DIR, `${fileName}.ts`);
  if (fs.existsSync(plainPath)) return plainPath;
  return null;
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main() {
  console.log('Creating output directories...');
  fs.mkdirSync(PREVIEWS_DIR, { recursive: true });
  fs.mkdirSync(ARTICLES_DIR, { recursive: true });

  // ── blog.json index (display:true articles only, ordered as in ARTICLES_METADATA) ──
  const displayedSlugs = ARTICLES_METADATA
    .filter(m => m.display !== false)
    .map(m => ({ id: m.slug }));

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'blog.json'),
    JSON.stringify({ articles: displayedSlugs }, null, 2),
    'utf-8'
  );
  console.log(`\u2713  blog.json  (${displayedSlugs.length} articles)`);

  // ── Per-article preview and full files ──────────────────────────────────
  let previewOk = 0, articleOk = 0, contentMissing = 0;

  for (const meta of ARTICLES_METADATA) {
    const slug = meta.slug;

    // ── Preview JSON ─────────────────────────────────────────────────────
    const preview = {
      id:          slug,
      slug,
      title:       meta.title,
      description: meta.description,
      author:      JOEL_HANSEN,
      publishedDate: meta.publishedDate,
      heroImage:   meta.heroImage,
      tags:        meta.tags,
      category:    meta.category,
      readingTime: meta.readTime || 5,
      featured:    meta.featured !== undefined ? meta.featured : false,
      display:     meta.display !== undefined ? meta.display : true,
    };

    if (meta.hasAudio !== undefined) preview.hasAudio = meta.hasAudio;
    if (meta.hasVideo !== undefined) preview.hasVideo = meta.hasVideo;
    if (meta.youtubeVideoId)         preview.youtubeVideoId = meta.youtubeVideoId;

    fs.writeFileSync(
      path.join(PREVIEWS_DIR, `${slug}.json`),
      JSON.stringify(preview, null, 2),
      'utf-8'
    );
    previewOk++;

    // ── Full article JSON ─────────────────────────────────────────────────
    const contentFilePath = getContentFilePath(slug);
    if (!contentFilePath) {
      console.warn(`  \u26a0  No content file for: ${slug}`);
      contentMissing++;

      // Write a stub full article without content so detail pages don't 404
      const stub = {
        ...preview,
        metaDescription:  meta.metaDescription || meta.description,
        metaKeywords:     meta.metaKeywords || [],
        relatedArticles:  meta.relatedArticles || [],
        content: []
      };
      fs.writeFileSync(
        path.join(ARTICLES_DIR, `${slug}.json`),
        JSON.stringify(stub, null, 2),
        'utf-8'
      );
      continue;
    }

    const rawContent = evalContentFile(contentFilePath);
    if (!rawContent) {
      console.warn(`  \u26a0  Could not parse content for: ${slug}`);
      contentMissing++;
    }

    const content = rawContent ? convertSeeAlsoIds(rawContent) : [];

    const article = {
      id:               slug,
      slug,
      title:            meta.title,
      description:      meta.description,
      author:           JOEL_HANSEN,
      publishedDate:    meta.publishedDate,
      heroImage:        meta.heroImage,
      tags:             meta.tags,
      category:         meta.category,
      readingTime:      meta.readTime || 5,
      readTime:         meta.readTime || 5,
      featured:         meta.featured !== undefined ? meta.featured : false,
      display:          meta.display !== undefined ? meta.display : true,
      metaDescription:  meta.metaDescription || meta.description,
      metaKeywords:     meta.metaKeywords || [],
      relatedArticles:  meta.relatedArticles || [],
      content,
    };

    if (meta.hasAudio !== undefined)  article.hasAudio = meta.hasAudio;
    if (meta.hasVideo !== undefined)  article.hasVideo = meta.hasVideo;
    if (meta.youtubeVideoId)          article.youtubeVideoId = meta.youtubeVideoId;
    if (meta.relatedTools)            article.relatedTools = meta.relatedTools;
    if (meta.relatedResources)        article.relatedResources = meta.relatedResources;

    fs.writeFileSync(
      path.join(ARTICLES_DIR, `${slug}.json`),
      JSON.stringify(article, null, 2),
      'utf-8'
    );
    articleOk++;
  }

  console.log(`\n\u2713  ${previewOk} preview files written to  ${PREVIEWS_DIR}`);
  console.log(`\u2713  ${articleOk} article files written to  ${ARTICLES_DIR}`);
  if (contentMissing > 0) {
    console.log(`\u26a0  ${contentMissing} articles had missing/unparseable content (stubs written)`);
  }
  console.log('\nDone.');
}

main();
