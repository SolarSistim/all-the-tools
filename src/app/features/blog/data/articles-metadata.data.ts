import { Article } from '../models/blog.models';
import { AUTHORS } from './authors.data';

/**
 * Article Metadata (without content)
 * Content is loaded separately from individual content files
 */
export type ArticleMetadata = Omit<Article, 'content'>;

export const BLOG_ARTICLES_METADATA: ArticleMetadata[] = [
  {
    id: '9',
    slug: 'my-wife-and-i-have-visited-georges-bistro-nearly-30-times',
    title: 'My Wife And I Have Visited George\'s Bistro Nearly 30 Times Over The Last Few Years. Here\'s Our Experience.',
    description:
      'After 30 visits over several years, George\'s Bistro has become our happy place. Here\'s an honest, detailed review of everything we\'ve tried - from the bone marrow to the ribeye to every cocktail on the menu.',
    author: AUTHORS.joel_hansen,
    publishedDate: '12-28-2025',
    heroImage: {
      src: '/meta-images/og-georges-bistro-review.png',
      alt: 'My Wife And I Have Visited George\'s Bistro Nearly 30 Times',
    },
    tags: ['Restaurant Review', 'Food', 'Fine Dining', 'Pensacola', 'George\'s Bistro'],
    category: 'Food & Dining',
    metaDescription:
      'An honest, detailed review of George\'s Bistro after 30 visits.',
    metaKeywords: [
      'George\'s Bistro',
      'Pensacola restaurants',
      'Fine dining',
      'Restaurant review',
      'Food review',
      'George\'s Bistro menu',
      'Best restaurants Pensacola',
    ],
    featured: true,
    relatedArticles: ['1', '4', '2'],
  },
  {
    id: '8',
    slug: 'i-built-a-roku-compatibility-checker',
    title: 'I Built a Roku Compatibility Checker (And This Is Why You Might Need It)',
    description:
      'After a decade of buying Rokus and struggling to find compatibility info, I spent a week compiling specs for every Roku product and built a simple web tool to solve this problem once and for all.',
    author: AUTHORS.joel_hansen,
    publishedDate: '12-27-2025',
    heroImage: {
      src: '/meta-images/og-roku-compatibility-checker.png',
      alt: 'I Built a Roku Compatibility Checker',
    },
    tags: ['Roku', 'Tools', 'Hardware', 'Compatibility', 'Product Review'],
    category: 'Technology',
    metaDescription:
      'After struggling to find Roku compatibility info, I built a web tool that shows you exactly what features and accessories work with your Roku model.',
    metaKeywords: [
      'Roku compatibility',
      'Roku checker',
      'Roku features',
      'Roku accessories',
      'Roku wireless speakers',
      'Roku soundbar',
      'Roku 4K',
      'Roku HDR',
    ],
    featured: true,
    relatedArticles: ['3', '5', '1'],
  },
  {
    id: '7',
    slug: 'these-song-lyrics-do-not-tease-the-grinch-they-unload-on-him',
    title: 'These Song Lyrics Do Not Tease the Grinch. They Unload on Him.',
    description:
      'A psychological breakdown of how "You\'re A Mean One, Mr. Grinch" isn\'t playful teasing - it\'s a brutal character assassination with surprising depth.',
    author: AUTHORS.joel_hansen,
    publishedDate: '12-24-2025',
    heroImage: {
      src: '/meta-images/og-these-song-lyrics-do-not-tease-the-grinch-they-unload-on-him.png',
      alt: 'These Song Lyrics Do Not Tease the Grinch. They Unload on Him.',
    },
    tags: ['The Grinch', 'Psychology', 'Christmas', 'Pop Culture Analysis'],
    category: 'TV & Film',
    metaDescription:
      'A psychological breakdown of how "You\'re A Mean One, Mr. Grinch" isn\'t playful teasing - it\'s a brutal character assassination.',
    metaKeywords: [
      'Grinch',
      'Mr. Grinch',
      'Psychology',
      'Christmas',
      'Pop Culture',
      'Character Analysis',
      'Song Analysis',
    ],
    featured: true,
    relatedArticles: ['6', '1', '2'],
  },
  {
    id: '6',
    slug: 'the-deneb-paradox-when-first-contact-means-last-contact',
    title: 'The Deneb Paradox: When First Contact Means Last Contact',
    description:
      'A deep dive into Pluribus episode 8\'s terrifying revelation about the Deneb aliens and their galaxy-spanning plan to absorb all conscious life.',
    author: AUTHORS.joel_hansen,
    publishedDate: '12-21-2025',
    heroImage: {
      src: '/meta-images/og-pluribus-the-deneb-paradox-when-first-contact-means-last-contact.png',
      alt: 'The Deneb Paradox: When First Contact Means Last Contact',
    },
    tags: ['Pluribus', 'TV Analysis', 'Science Fiction', 'Vince Gilligan'],
    category: 'TV & Film',
    metaDescription:
      'A deep dive into Pluribus episode 8\'s terrifying revelation about the Deneb aliens and their galaxy-spanning plan to absorb all conscious life.',
    metaKeywords: [
      'Pluribus',
      'Deneb aliens',
      'TV analysis',
      'Science fiction',
      'Vince Gilligan',
      'Hive mind',
      'First contact',
    ],
    featured: true,
    relatedArticles: ['4', '1', '2'],
  },
  {
    id: '5',
    slug: 'how-to-calculate-percentages-in-your-head',
    title: 'How to Calculate Percentages in Your Head (Without Looking Like a Dunce)',
    description:
      'Master mental math with simple tricks to calculate percentages instantly. No more fumbling with your phone calculator.',
    author: AUTHORS.joel_hansen,
    publishedDate: '12-21-2025',
    heroImage: {
      src: '/meta-images/og-how-to-calculate-percentages-in-your-head.png',
      alt: 'How to Calculate Percentages in Your Head',
    },
    tags: ['Math', 'Mental Math', 'Tips', 'Life Skills'],
    category: 'Education',
    metaDescription:
      'Master mental math with simple tricks to calculate percentages instantly. No more fumbling with your phone calculator.',
    metaKeywords: [
      'Mental Math',
      'Calculate Percentages',
      'Math Tricks',
      'Quick Math',
      'Percentage Calculation',
      'Math Tips',
    ],
    featured: true,
    relatedArticles: ['3', '2', '4'],
  },
  {
    id: '4',
    slug: 'why-truckers-drift-to-the-right-on-the-highway',
    title: 'Why Truckers Drift to the Right on the Highway',
    description:
      'Ever wonder why semi-trucks veer toward the shoulder? The reasons are more intentional - and darker - than you think.',
    author: AUTHORS.joel_hansen,
    publishedDate: '12-21-2025',
    heroImage: {
      src: '/meta-images/og-why-do-semi-truckers-veer-to-the-right-on-the-highway.png',
      alt: 'Why Truckers Drift to the Right on the Highway',
    },
    tags: ['Trucking', 'Highway Safety', 'Transportation', 'Road Safety'],
    category: 'Amateur Sleuthing',
    metaDescription:
      'Ever wonder why semi-trucks veer toward the shoulder? The reasons are more intentional—and darker—than you think.',
    metaKeywords: [
      'Trucking',
      'Highway Safety',
      'Semi-Trucks',
      'Road Safety',
      'Transportation',
      'Driver Fatigue',
    ],
    featured: true,
    relatedArticles: ['1', '6', '2'],
  },
  {
    id: '3',
    slug: 'wordpress-vs-angular-why-i-built-my-site-with-zero-backend',
    title: 'WordPress vs. Angular: Why I Built My Site With Zero Backend',
    description:
      'Why I chose Angular over WordPress to build AllTheTools.dev - complete control, zero technical debt, and no database required.',
    author: AUTHORS.joel_hansen,
    publishedDate: '12-06-2025',
    heroImage: {
      src: '/meta-images/og-why-i-build-my-site-with-zero-backend.png',
      alt: 'WordPress vs. Angular: Why I Built My Site With Zero Backend',
    },
    tags: ['Angular', 'WordPress', 'Web Development', 'Static Sites'],
    category: 'Technology',
    metaDescription:
      'Why I chose Angular over WordPress to build AllTheTools.dev - complete control, zero technical debt, and no database required.',
    metaKeywords: [
      'Angular',
      'WordPress',
      'Web Development',
      'Static Sites',
      'Front-End',
      'CMS',
    ],
    featured: true,
    relatedArticles: ['2', '5', '1'],
  },
  {
    id: '2',
    slug: 'i-switched-from-facebook-to-reddit-for-doomscrolling',
    title: 'I Switched from Facebook to Reddit for Doomscrolling. Here\'s What Happened.',
    description:
      'How I broke my Facebook addiction by redirecting my doomscrolling habit to something that actually gives back.',
    author: AUTHORS.joel_hansen,
    publishedDate: '12-04-2025',
    heroImage: {
      src: '/meta-images/og-i-switched-from-facebook-to-reddit-for-doomscrolling.png',
      alt: 'I Switched from Facebook to Reddit for Doomscrolling',
    },
    tags: ['Social Media', 'Reddit', 'Facebook', 'Productivity'],
    category: 'Technology',
    metaDescription:
      'How I broke my Facebook addiction by redirecting my doomscrolling habit to something that actually gives back.',
    metaKeywords: [
      'Facebook',
      'Reddit',
      'Doomscrolling',
      'Social Media',
      'Productivity',
    ],
    featured: true,
    relatedArticles: ['3', '5', '6'],
  },
  {
    id: '1',
    slug: 'the-wild-story-of-the-gaudy-palace-on-scenic-highway',
    title: 'The WILD Story of the Gaudy Palace on Scenic Highway',
    description:
      "How a golden-roofed mansion became Pensacola's most controversial landmark.",
    author: AUTHORS.joel_hansen,
    publishedDate: '12-02-2025',
    heroImage: {
      src: '/meta-images/og-the-wild-story-of-the-gaudy-palace.png',
      alt: 'The WILD Story of the Gaudy Palace on Scenic Highway',
    },
    tags: ['Pensacola', 'Scenic Highway', 'Palace'],
    category: 'Amateur Sleuthing',
    metaDescription:
      "How a golden-roofed mansion became Pensacola's most controversial landmark.",
    metaKeywords: [
      'Pensacola',
      'Scenic Highway',
      'Palace',
    ],
    featured: true,
    relatedArticles: ['4', '2', '3'],
  },
];
