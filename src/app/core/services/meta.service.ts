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
    type: 'website'
  };

  /**
   * Update all meta tags for a page
   * @param config Meta configuration for the page
   */
  updateTags(config: MetaConfig): void {
    const fullConfig = { ...this.defaultConfig, ...config };

    // Update page title
    this.titleService.setTitle(fullConfig.title);

    // Update basic meta tags
    this.meta.updateTag({ name: 'description', content: fullConfig.description });

    if (fullConfig.keywords && fullConfig.keywords.length > 0) {
      this.meta.updateTag({ name: 'keywords', content: fullConfig.keywords.join(', ') });
    }

    // Update Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: fullConfig.title });
    this.meta.updateTag({ property: 'og:description', content: fullConfig.description });
    this.meta.updateTag({ property: 'og:type', content: fullConfig.type || 'website' });

    if (fullConfig.url) {
      this.meta.updateTag({ property: 'og:url', content: fullConfig.url });
    }

    if (fullConfig.image) {
      this.meta.updateTag({ property: 'og:image', content: fullConfig.image });
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

    if (fullConfig.image) {
      this.meta.updateTag({ name: 'twitter:image', content: fullConfig.image });
      this.meta.updateTag({ name: 'twitter:image:alt', content: fullConfig.title });
    }

    // Add canonical URL
    if (fullConfig.url) {
      this.updateCanonicalUrl(fullConfig.url);
    }
  }

  /**
   * Update canonical URL
   * @param url Canonical URL for the page
   */
  private updateCanonicalUrl(url: string): void {
    // Only update canonical link in browser
    if (isPlatformBrowser(this.platformId)) {
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
  }

  /**
   * Reset to default meta tags
   */
  resetToDefaults(): void {
    this.updateTags(this.defaultConfig);
  }
}
