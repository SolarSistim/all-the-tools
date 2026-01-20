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
  display?: boolean; // Controls visibility on blog listing (defaults to true)
  relatedArticles?: string[]; // Article IDs
  hasAudio?: boolean; // Indicates if article has audio version
  readTime?: number; // Estimated read time in minutes
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
  display?: boolean; // Controls visibility on blog listing (defaults to true)
  hasAudio?: boolean; // Indicates if article has audio version
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
  | 'divider'
  | 'adsense'
  | 'component'
  | 'moviePoster'
  | 'movieRatings'
  | 'video'
  | 'audio';

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
 * Movie Poster block
 * Displays a movie poster that floats left with text wrapping around it
 */
export interface MoviePosterBlock extends ContentBlock {
  type: 'moviePoster';
  data: {
    src: string;
    alt: string;
    caption?: string; // Only shown in lightbox
    width?: number;
    height?: number;
  };
}

/**
 * Movie Ratings block
 * Displays movie ratings from multiple review sources
 */
export interface MovieRatingsBlock extends ContentBlock {
  type: 'movieRatings';
  data: {
    title: string;
    year: number;
    posterSrc: string;
    posterAlt: string;
    ratings: Array<{
      source: 'RottenTomatoesCritic' | 'RottenTomatoesAudience' | 'Letterboxd' | 'IMDB' | 'MetacriticMetascore' | 'MetacriticUser' | 'Trakt';
      score: number;
      maxScore: number;
    }>;
    ratingsDate: string; // Date when ratings were captured
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
 * AdSense block
 */
export interface AdsenseBlock extends ContentBlock {
  type: 'adsense';
  data: {
    adClient?: string;
    adSlot?: string;
    width?: string;
    height?: string;
  };
}

/**
 * Component block
 */
export interface ComponentBlock extends ContentBlock {
  type: 'component';
  data: {
    componentName: string;
  };
}

/**
 * Video block (YouTube embeds)
 */
export interface VideoBlock extends ContentBlock {
  type: 'video';
  data: {
    url: string;
    title?: string;
    description?: string;
    platform?: 'youtube' | 'vimeo';
  };
}

/**
 * Audio block (MP3 player)
 */
export interface AudioBlock extends ContentBlock {
  type: 'audio';
  data: {
    src: string;
    title?: string;
    description?: string;
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
