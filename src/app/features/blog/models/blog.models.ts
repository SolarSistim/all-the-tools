/**
 * Blog Data Models
 * Interfaces and types for the blog feature
 */

/**
 * Author information
 */
export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

/**
 * Article metadata and content
 */
export interface Article {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: ContentBlock[];
  author: Author;
  publishedDate: Date | string;
  updatedDate?: Date | string;
  heroImage: HeroImageData;
  tags: string[];
  category: string;
  metaDescription: string;
  metaKeywords?: string[];
  ogImage?: string;
  featured?: boolean;
  relatedArticles?: string[]; // Article IDs
}

/**
 * Lightweight article preview for listings
 */
export interface ArticlePreview {
  id: string;
  slug: string;
  title: string;
  description: string;
  author: Author;
  publishedDate: Date | string;
  heroImage: HeroImageData;
  tags: string[];
  category: string;
  readingTime: number; // in minutes
  featured?: boolean;
}

/**
 * Hero image data
 */
export interface HeroImageData {
  src: string;
  alt: string;
  credit?: string;
  creditUrl?: string;
}

/**
 * Content block types
 */
export type ContentBlockType =
  | 'paragraph'
  | 'heading'
  | 'image'
  | 'gallery'
  | 'blockquote'
  | 'code'
  | 'list'
  | 'cta'
  | 'affiliate'
  | 'divider';

/**
 * Base content block
 */
export interface ContentBlock {
  type: ContentBlockType;
  data: any;
}

/**
 * Paragraph block
 */
export interface ParagraphBlock extends ContentBlock {
  type: 'paragraph';
  data: {
    text: string;
    className?: string;
  };
}

/**
 * Heading block
 */
export interface HeadingBlock extends ContentBlock {
  type: 'heading';
  data: {
    level: 2 | 3 | 4 | 5 | 6;
    text: string;
    id?: string; // for anchor links
  };
}

/**
 * Image block
 */
export interface ImageBlock extends ContentBlock {
  type: 'image';
  data: {
    src: string;
    alt: string;
    caption?: string;
    credit?: string;
    creditUrl?: string;
    width?: number;
    height?: number;
  };
}

/**
 * Gallery block
 */
export interface GalleryBlock extends ContentBlock {
  type: 'gallery';
  data: {
    images: Array<{
      src: string;
      alt: string;
      caption?: string;
    }>;
    layout?: 'grid' | 'masonry' | 'slider';
  };
}

/**
 * Blockquote block
 */
export interface BlockquoteBlock extends ContentBlock {
  type: 'blockquote';
  data: {
    text: string;
    citation?: string;
    citationUrl?: string;
  };
}

/**
 * Code block
 */
export interface CodeBlock extends ContentBlock {
  type: 'code';
  data: {
    code: string;
    language?: string;
    filename?: string;
    highlightLines?: number[];
  };
}

/**
 * List block
 */
export interface ListBlock extends ContentBlock {
  type: 'list';
  data: {
    style: 'ordered' | 'unordered';
    items: string[];
  };
}

/**
 * CTA (Call to Action) block
 */
export interface CtaBlock extends ContentBlock {
  type: 'cta';
  data: {
    title: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
    variant?: 'primary' | 'secondary' | 'outline';
  };
}

/**
 * Affiliate product block
 */
export interface AffiliateBlock extends ContentBlock {
  type: 'affiliate';
  data: AffiliateProduct;
}

/**
 * Divider block
 */
export interface DividerBlock extends ContentBlock {
  type: 'divider';
  data: {
    style?: 'line' | 'dots' | 'stars';
  };
}

/**
 * Affiliate product data
 */
export interface AffiliateProduct {
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  price?: string;
  priceNote?: string;
  link: string;
  buttonText?: string;
  features?: string[];
  disclosure?: string;
  rating?: number;
  reviewCount?: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Blog configuration
 */
export interface BlogConfig {
  pageSize: number;
  baseUrl: string;
  defaultOgImage: string;
}
