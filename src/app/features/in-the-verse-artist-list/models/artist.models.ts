/**
 * YouTube video entry for artist gallery
 */
export interface ArtistVideo {
  id: string;
  title?: string;
  thumbnail?: string;
}

/**
 * Artist information for 3D artists directory
 */
export interface Artist {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription?: string;
  keywords: string[];
  youtubeVideoId?: string;
  youtubeVideos?: ArtistVideo[];
  image?: string;
  ogImage?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  links?: ArtistLinks;
  publishedDate: Date | string;
  updatedDate?: Date | string;
  featured?: boolean;
  display?: boolean;
}

/**
 * Artist social/portfolio links
 */
export interface ArtistLinks {
  website?: string;
  artstation?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  behance?: string;
  linkedin?: string;
  blendermarket?: string;
  gumroad?: string;
  patreon?: string;
}

/**
 * Lightweight artist preview for listings
 */
export interface ArtistPreview {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  keywords: string[];
  image?: string;
  ogImage?: string;
  publishedDate: Date | string;
  featured?: boolean;
  display?: boolean;
  hasVideo?: boolean;
  youtubeVideoId?: string;
  youtubeVideos?: ArtistVideo[];
}

/**
 * Paginated response
 */
export interface PaginatedArtistResponse<T> {
  items: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Artists configuration
 */
export interface ArtistsConfig {
  pageSize: number;
  baseUrl: string;
  defaultOgImage: string;
}

/**
 * Filter options for artists
 */
export interface ArtistFilters {
  keyword?: string;
  search?: string;
  featured?: boolean;
  hasVideo?: boolean;
}
