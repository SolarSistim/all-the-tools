import { Article } from '../models/blog.models';
import { AUTHORS } from './authors.data';

/**
 * Article Metadata (without content)
 * Content is loaded separately from individual content files
 */
export type ArticleMetadata = Omit<Article, 'content'>;

export const BLOG_ARTICLES_METADATA: ArticleMetadata[] = [
  {
    id: '1',
    slug: 'the-wild-story-of-the-gaudy-palace-on-scenic-highway',
    title: 'The WILD Story of the Gaudy Palace on Scenic Highway',
    description:
      "How a golden-roofed mansion became Pensacola's most controversial landmark.",
    author: AUTHORS.joel_hansen,
    publishedDate: '12-04-2025',
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
