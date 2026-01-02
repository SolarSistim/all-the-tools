/**
 * Resource metadata and information
 */
export interface Resource {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  externalUrl: string;
  tags: string[];
  category: string;
  publishedDate: Date | string;
  updatedDate?: Date | string;
  thumbnail: ThumbnailData;
  metaDescription: string;
  metaKeywords?: string[];
  featured?: boolean;
  display?: boolean;
  relatedResources?: string[];
  isPaid?: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * Lightweight resource preview for listings
 */
export interface ResourcePreview {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  externalUrl: string;
  publishedDate: Date | string;
  thumbnail: ThumbnailData;
  tags: string[];
  category: string;
  featured?: boolean;
  display?: boolean;
  isPaid?: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * Thumbnail image data
 */
export interface ThumbnailData {
  src: string;
  alt: string;
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
 * Resources configuration
 */
export interface ResourcesConfig {
  pageSize: number;
  baseUrl: string;
  defaultOgImage: string;
}

/**
 * Resource metadata type (same as Resource since no content separation needed)
 */
export type ResourceMetadata = Resource;

/**
 * Filter options for resources
 */
export interface ResourceFilters {
  category?: string;
  tag?: string;
  search?: string;
  featured?: boolean;
  isPaid?: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * View mode type for resource listings
 */
export type ViewMode = 'tile-4' | 'list';
