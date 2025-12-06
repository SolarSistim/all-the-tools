import { Article } from '../models/blog.models';
import { AUTHORS } from './authors.data';

/**
 * Article Metadata (without content)
 * Content is loaded separately from individual content files
 */
export type ArticleMetadata = Omit<Article, 'content'>;

export const BLOG_ARTICLES_METADATA: ArticleMetadata[] = [
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
  },
];
