import { Component, inject, OnInit, signal, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ToolsService } from '../../core/services/tools.service';
import { MetaService } from '../../core/services/meta.service';
import { Tool, ToolCategoryMeta } from '../../core/models/tool.interface';
import { ToolCardComponent } from '../../shared/components/tool-card/tool-card';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';

interface SeoCategorySection {
  id: string;
  name: string;
  description: string;
  categoryIds: string[];
  tools?: Tool[];
}

@Component({
  selector: 'app-tools',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    ToolCardComponent,
    PageHeaderComponent
  ],
  templateUrl: './tools.html',
  styleUrl: './tools.scss',
})
export class ToolsComponent implements OnInit {
  private toolsService = inject(ToolsService);
  private metaService = inject(MetaService);
  private route = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);

  allTools: Tool[] = [];
  filteredTools: Tool[] = [];
  categories: ToolCategoryMeta[] = [];
  searchQuery = signal('');
  selectedCategory = signal<string | null>(null);

  // Popular tools for internal linking (SEO boost)
  popularTools: Tool[] = [];

  // SEO Category Sections - aligned with actual tool categories
  seoCategorySections: SeoCategorySection[] = [];

  ngOnInit(): void {
    // Update meta tags for SEO
    this.metaService.updateTags({
      title: 'Online Toolbox of Free Web Utilities — All The Tools',
      description: 'Find free web tools for developers, marketers, and creators. Fast, secure online calculators, converters, generators, and utilities — all in one place.',
      keywords: ['online tools', 'web tools', 'free utilities', 'text tools', 'calculators', 'converters', 'generators', 'developer tools', 'marketing tools', 'online toolbox'],
      image: 'https://www.allthethings.dev/meta-images/og-tools.png',
      url: 'https://www.allthethings.dev/tools'
    });

    this.allTools = this.toolsService.getAvailableTools();
    this.filteredTools = this.allTools;
    this.categories = this.toolsService.getAllCategories();

    // Build SEO category sections from actual categories
    this.buildSeoCategorySections();

    // Set popular tools for internal linking
    this.setPopularTools();

    // Add structured data
    this.addStructuredData();

    // Check if there's a category query parameter
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.filterByCategory(params['category']);
      }
    });
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.applyFilters();
  }

  filterByCategory(categoryId: string | null): void {
    this.selectedCategory.set(categoryId);
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set(null);
    this.filteredTools = this.allTools;
  }

  private applyFilters(): void {
    let tools = this.allTools;

    // Filter by category
    if (this.selectedCategory()) {
      tools = tools.filter(tool => tool.category === this.selectedCategory());
    }

    // Filter by search query
    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      tools = tools.filter(tool =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    this.filteredTools = tools;
  }

  getCategoryName(categoryId: string): string {
    return this.categories.find(c => c.id === categoryId)?.name || categoryId;
  }

  private buildSeoCategorySections(): void {
    // Map categories with custom descriptions for SEO
    const categoryDescriptions: Record<string, string> = {
      'generator': 'Generate passwords, UUIDs, QR codes, and placeholder text for development and content creation.',
      'math': 'Calculate percentages, tips, BMI, and convert between number systems including binary, hex, and Roman numerals.',
      'converter': 'Convert units of measurement, currencies, and more with real-time exchange rates.',
      'text': 'Count words, change text case, and analyze content for writing and publishing.',
      'color': 'Pick colors, generate gradients, and get HEX, RGB, and HSL values for design work.',
      'time': 'Convert timestamps, time zones, and work with dates across different formats.',
      'image': 'Edit photos, generate icons, and manipulate images with filters and adjustments.',
      'social': 'Tools for social media marketers to format posts, manage content, and optimize engagement.',
      'ocr': 'Scan barcodes and extract text from images using optical character recognition.',
      'music': 'Convert Morse code, export playlists, and work with audio formats.',
      'hardware': 'Check device compatibility and specifications for streaming hardware.'
    };

    // Build sections from categories that have tools
    this.seoCategorySections = this.categories
      .filter(cat => {
        const tools = this.allTools.filter(tool => tool.category === cat.id);
        return tools.length > 0;
      })
      .map(cat => ({
        id: cat.id,
        name: cat.name,
        description: categoryDescriptions[cat.id] || cat.description,
        categoryIds: [cat.id],
        tools: this.allTools.filter(tool => tool.category === cat.id)
      }));
  }

  private setPopularTools(): void {
    // Select popular/featured tools for internal linking
    const popularToolIds = [
      'password-generator',
      'qr-code-generator',
      'uuid-generator',
      'base-number-converter',
      'word-counter',
      'gradient-generator',
      'percentage-calculator',
      'color-picker',
      'barcode-reader',
      'social-media-launchpad'
    ];

    this.popularTools = popularToolIds
      .map(id => this.allTools.find(tool => tool.id === id))
      .filter((tool): tool is Tool => tool !== undefined);
  }

  scrollToSection(sectionId: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const element = document.getElementById(sectionId);
    if (!element) {
      return;
    }

    // Get the mat-sidenav-content element (which is the actual scroll container)
    const sidenavContent = document.querySelector('mat-sidenav-content');

    if (sidenavContent) {
      // Calculate the element's position relative to the sidenav content
      const elementRect = element.getBoundingClientRect();
      const sidenavRect = sidenavContent.getBoundingClientRect();
      const scrollTop = sidenavContent.scrollTop;

      // Calculate target scroll position with offset for spacing
      const targetPosition = scrollTop + elementRect.top - sidenavRect.top - 100;

      // Scroll the sidenav content
      sidenavContent.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }

    // Also scroll window as fallback
    const yOffset = -100;
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  private addStructuredData(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Remove existing structured data script if present
    const existingScript = document.getElementById('tools-structured-data');
    if (existingScript) {
      existingScript.remove();
    }

    // Create WebPage + ItemList structured data with Organization
    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': 'https://www.allthethings.dev/tools',
          'url': 'https://www.allthethings.dev/tools',
          'name': 'Online Toolbox of Free Web Tools for Developers, Marketers, and Creators',
          'headline': 'Online Toolbox of Free Web Tools for Developers, Marketers, and Creators',
          'description': 'All The Tools is a one-stop online toolbox packed with fast, free web utilities for developers, marketers, and everyday creators.',
          'inLanguage': 'en-US',
          'isPartOf': {
            '@type': 'WebSite',
            'url': 'https://www.allthethings.dev',
            'name': 'All The Tools'
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'All The Tools',
            'url': 'https://www.allthethings.dev'
          }
        },
        {
          '@type': 'ItemList',
          'name': 'Free Online Tools',
          'description': 'A comprehensive collection of free web utilities for developers, marketers, and creators',
          'numberOfItems': this.allTools.length,
          'itemListElement': this.allTools.map((tool, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'name': tool.name,
            'url': `https://www.allthethings.dev/tools/${tool.route}`,
            'description': tool.description
          }))
        }
      ]
    };

    const script = document.createElement('script');
    script.id = 'tools-structured-data';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }
}
