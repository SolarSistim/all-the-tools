import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

/**
 * Configuration for WebApplication schema
 */
export interface WebAppSchema {
  name: string;
  description: string;
  url: string;
  applicationCategory?: string;
  offers?: {
    price: string;
    priceCurrency: string;
  };
}

/**
 * Configuration for WebPage schema
 */
export interface WebPageSchema {
  name: string;
  description: string;
  url: string;
}

/**
 * Configuration for Article schema
 */
export interface ArticleSchema {
  headline: string;
  description: string;
  image: string;
  url: string;
  author: {
    name: string;
    url?: string;
  };
  datePublished: string;
  dateModified?: string;
  keywords?: string[];
}

/**
 * StructuredDataService
 * Service for managing JSON-LD structured data (schema.org)
 * Helps search engines understand your content better for rich snippets
 */
@Injectable({
  providedIn: 'root'
})
export class StructuredDataService {
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);
  private scriptId = 'structured-data-script';

  /**
   * Convert relative URLs to absolute URLs
   * @param url URL to convert (can be relative or absolute)
   * @returns Absolute URL
   */
  private toAbsoluteUrl(url: string): string {
    if (!url) return url;

    // If already absolute, return as-is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // Convert relative to absolute
    if (url.startsWith('/')) {
      return `https://www.allthethings.dev${url}`;
    }

    return url;
  }

  /**
   * Add WebApplication schema (for tool pages)
   * @param config WebApplication configuration
   */
  addWebApplication(config: WebAppSchema): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: config.name,
      description: config.description,
      url: config.url,
      applicationCategory: config.applicationCategory || 'UtilitiesApplication',
      browserRequirements: 'Requires JavaScript. Modern browser required.',
      offers: config.offers || {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      },
      operatingSystem: 'Any',
      permissions: 'browser'
    };

    this.insertStructuredData(schema);
  }

  /**
   * Add WebPage schema (for content pages)
   * @param config WebPage configuration
   */
  addWebPage(config: WebPageSchema): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: config.name,
      description: config.description,
      url: config.url,
      inLanguage: 'en-US',
      isPartOf: {
        '@type': 'WebSite',
        name: 'All The Things',
        url: 'https://www.allthethings.dev'
      }
    };

    this.insertStructuredData(schema);
  }

  /**
   * Add Organization schema (for homepage/footer)
   */
  addOrganization(): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'All The Things',
      url: 'https://www.allthethings.dev',
      logo: 'https://www.allthethings.dev/favicon.ico',
      description: 'Free online tools for text, images, developers, and more',
      sameAs: [
        // Add your social media URLs here when available
        // 'https://twitter.com/allthetools',
        // 'https://github.com/allthetools'
      ]
    };

    this.insertStructuredData(schema);
  }

  /**
   * Add WebSite schema with SearchAction for homepage
   */
  addWebSite(): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'All The Things',
      url: 'https://www.allthethings.dev',
      description: 'A one-stop online toolbox of free web utilities for developers, marketers, and creators',
      inLanguage: 'en-US',
      publisher: {
        '@type': 'Organization',
        name: 'All The Things',
        url: 'https://www.allthethings.dev'
      }
    };

    this.insertStructuredData(schema);
  }

  /**
   * Add BreadcrumbList schema
   * @param breadcrumbs Array of breadcrumb items
   */
  addBreadcrumbs(breadcrumbs: Array<{ name: string; url: string }>): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url
      }))
    };

    this.insertStructuredData(schema);
  }

  /**
   * Add Article schema (for blog posts)
   * @param config Article configuration
   */
  addArticle(config: ArticleSchema): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: config.headline,
      description: config.description,
      image: this.toAbsoluteUrl(config.image),
      url: config.url,
      author: {
        '@type': 'Person',
        name: config.author.name,
        url: config.author.url
      },
      publisher: {
        '@type': 'Organization',
        name: 'All The Things',
        url: 'https://www.allthethings.dev',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.allthethings.dev/favicon.ico'
        }
      },
      datePublished: config.datePublished,
      dateModified: config.dateModified || config.datePublished,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': config.url
      },
      keywords: config.keywords?.join(', '),
      inLanguage: 'en-US'
    };

    this.insertStructuredData(schema);
  }

  /**
   * Insert structured data script into document head
   * @param schema Schema object to insert
   */
  private insertStructuredData(schema: any): void {
    // Only insert in browser
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Remove existing script if present
    const existingScript = this.document.getElementById(this.scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    // Create new script element
    const script = this.document.createElement('script');
    script.id = this.scriptId;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);

    // Append to head
    this.document.head.appendChild(script);
  }

  /**
   * Remove structured data script
   */
  removeStructuredData(): void {
    if (isPlatformBrowser(this.platformId)) {
      const existingScript = this.document.getElementById(this.scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    }
  }
}
