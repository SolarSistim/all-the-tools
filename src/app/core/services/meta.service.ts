import { Injectable, inject, PLATFORM_ID, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

/**
 * Configuration interface for meta tags
 */
export interface MetaConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
  robots?: string;
  jsonLd?: Record<string, unknown>;
}

export interface ToolJsonLdOptions {
  name: string;
  description: string;
  url: string;
  image?: string;
  breadcrumbs?: Array<{ name: string; item: string }>;
}

export interface WebSiteJsonLdOptions {
  name: string;
  url: string;
  searchUrl: string;
}

/**
 * MetaService
 * Service for managing SEO meta tags, Open Graph, and Twitter Card tags
 */
@Injectable({
  providedIn: 'root'
})
export class MetaService {
  private meta = inject(Meta);
  private titleService = inject(Title);
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  private readonly defaultConfig: MetaConfig = {
    title: 'All The Things - Your Swiss Army Knife of Web Utilities',
    description: 'Free online tools for text, images, developers, and more. Word counter, case converter, JSON formatter, and 20+ other utilities.',
    keywords: ['online tools', 'web utilities', 'free tools'],
    image: 'https://www.allthethings.dev/meta-images/og-home.png',
    url: 'https://www.allthethings.dev/',
    type: 'website',
    robots: 'index,follow'
  };

  /**
   * Convert relative URLs to absolute URLs for social media
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

  private normalizeUrl(url: string): string {
    if (!url) return 'https://www.allthethings.dev';

    const productionDomain = 'https://www.allthethings.dev';

    try {
      if (url.startsWith('/')) {
        return `${productionDomain}${url === '/' ? '' : url}`;
      }

      const path = new URL(url).pathname;
      return `${productionDomain}${path === '/' ? '' : path}`;
    } catch {
      return productionDomain;
    }
  }

  /**
   * Update all meta tags for a page
   * @param config Meta configuration for the page
   */
  updateTags(config: MetaConfig): void {
    const fullConfig = { ...this.defaultConfig, ...config };
    const canonicalUrl = fullConfig.url ? this.normalizeUrl(fullConfig.url) : undefined;

    // Convert image URL to absolute if it's relative
    const absoluteImageUrl = fullConfig.image ? this.toAbsoluteUrl(fullConfig.image) : undefined;

    // Update page title
    this.titleService.setTitle(fullConfig.title);

    // Update basic meta tags
    this.meta.updateTag({ name: 'description', content: fullConfig.description });

    if (fullConfig.keywords && fullConfig.keywords.length > 0) {
      this.meta.updateTag({ name: 'keywords', content: fullConfig.keywords.join(', ') });
    }

    if (fullConfig.robots) {
      this.meta.updateTag({ name: 'robots', content: fullConfig.robots });
    }

    // Update Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: fullConfig.title });
    this.meta.updateTag({ property: 'og:description', content: fullConfig.description });
    this.meta.updateTag({ property: 'og:type', content: fullConfig.type || 'website' });

    if (canonicalUrl) {
      this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    }

    if (absoluteImageUrl) {
      this.meta.updateTag({ property: 'og:image', content: absoluteImageUrl });
      this.meta.updateTag({ property: 'og:image:width', content: '1200' });
      this.meta.updateTag({ property: 'og:image:height', content: '630' });
      this.meta.updateTag({ property: 'og:image:alt', content: fullConfig.title });
    }

    // Update Twitter Card tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:site', content: '@AllTheDev' });
    this.meta.updateTag({ name: 'twitter:creator', content: '@AllTheDev' });
    this.meta.updateTag({ name: 'twitter:title', content: fullConfig.title });
    this.meta.updateTag({ name: 'twitter:description', content: fullConfig.description });

    if (absoluteImageUrl) {
      this.meta.updateTag({ name: 'twitter:image', content: absoluteImageUrl });
      this.meta.updateTag({ name: 'twitter:image:alt', content: fullConfig.title });
    }

    if (fullConfig.jsonLd) {
      this.updateJsonLd(fullConfig.jsonLd, 'structured-data');
    } else {
      this.removeJsonLd('structured-data');
    }

    // Add canonical URL
    if (canonicalUrl) {
      this.updateCanonicalUrl(canonicalUrl);
    }
  }

  /**
   * Update canonical URL
   * @param url Canonical URL for the page
   */
  private updateCanonicalUrl(url: string): void {
    // Remove existing canonical link if it exists
    const existingLink = this.document.querySelector('link[rel="canonical"]');
    if (existingLink) {
      existingLink.remove();
    }

    // Create new canonical link
    const link = this.document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
    this.document.head.appendChild(link);
  }

  setSiteJsonLd(data: Record<string, unknown>): void {
    this.updateJsonLd(data, 'structured-data-site');
  }

  clearSiteJsonLd(): void {
    this.removeJsonLd('structured-data-site');
  }

  buildToolJsonLd(options: ToolJsonLdOptions): Record<string, unknown> {
    const webApplication: Record<string, unknown> = {
      '@type': 'WebApplication',
      name: options.name,
      description: options.description,
      url: options.url,
      applicationCategory: 'WebApplication',
      operatingSystem: 'All'
    };

    if (options.image) {
      webApplication['image'] = options.image;
    }

    const breadcrumbs = options.breadcrumbs ?? [
      { name: 'Home', item: 'https://www.allthethings.dev/' },
      { name: 'Tools', item: 'https://www.allthethings.dev/tools' },
      { name: options.name, item: options.url }
    ];

    return {
      '@context': 'https://schema.org',
      '@graph': [
        webApplication,
        this.buildBreadcrumbList(breadcrumbs)
      ]
    };
  }

  buildWebSiteJsonLd(options: WebSiteJsonLdOptions): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: options.name,
      url: options.url,
      potentialAction: {
        '@type': 'SearchAction',
        target: options.searchUrl,
        'query-input': 'required name=search_term_string'
      }
    };
  }

  private buildBreadcrumbList(items: Array<{ name: string; item: string }>): Record<string, unknown> {
    return {
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.item
      }))
    };
  }

  private updateJsonLd(data: Record<string, unknown>, scriptId: string): void {
    const existing = this.document.head.querySelector(`script#${scriptId}`);
    const script = existing ?? this.document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('id', scriptId);
    script.textContent = JSON.stringify(data);
    if (!existing) {
      this.document.head.appendChild(script);
    }
  }

  private removeJsonLd(scriptId: string): void {
    const existing = this.document.head.querySelector(`script#${scriptId}`);
    if (existing) {
      existing.remove();
    }
  }

  /**
   * Reset to default meta tags
   */
  resetToDefaults(): void {
    this.updateTags(this.defaultConfig);
  }
}
