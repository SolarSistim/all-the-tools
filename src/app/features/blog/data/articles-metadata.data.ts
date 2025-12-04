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
    slug: 'getting-started-with-web-development-tools',
    title: 'Getting Started with Web Development Tools: A Complete Guide',
    description:
      'Learn about essential web development tools that will boost your productivity and help you build better websites faster.',
    author: AUTHORS.joel_hansen,
    publishedDate: '2025-01-15',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=630&fit=crop',
      alt: 'Developer working on laptop with code on screen',
      credit: 'Christopher Gower',
      creditUrl: 'https://unsplash.com/@cgower',
    },
    tags: ['web development', 'tools', 'productivity', 'beginner'],
    category: 'Web Development',
    metaDescription:
      'Discover essential web development tools that will boost your productivity. Learn about code editors, version control, debugging tools, and more.',
    metaKeywords: [
      'web development tools',
      'developer productivity',
      'code editor',
      'debugging',
    ],
    featured: true,
  },
];
