import { Article } from '../models/blog.models';
import { AUTHORS } from './authors.data';

/**
 * Article Metadata (without content)
 * Content is loaded separately from individual content files
 */
export type ArticleMetadata = Omit<Article, 'content'>;

export const BLOG_ARTICLES_METADATA: ArticleMetadata[] = [
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
