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
        name: 'All The Tools',
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
      name: 'All The Tools',
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
