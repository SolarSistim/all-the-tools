import { Component, inject, OnInit, signal, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
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

  // SEO Category Sections
  seoCategorySections: SeoCategorySection[] = [
    {
      id: 'developer-tools',
      name: 'Developer Tools',
      description: 'Tools built for developers and technical users, including generators, converters, and utilities for working with data, code, colors, identifiers, and formats commonly used in modern web development.',
      categoryIds: ['generator', 'color', 'time', 'hardware']
    },
    {
      id: 'marketing-tools',
      name: 'Marketing Tools',
      description: 'Online tools for marketers and content creators, designed to help with copy preparation, social media posting, formatting, and quick calculations without bloated dashboards or subscriptions.',
      categoryIds: ['social']
    },
    {
      id: 'text-writing-tools',
      name: 'Text & Writing Tools',
      description: 'Simple text utilities for counting words, transforming case, generating placeholder content, and preparing text for publishing, coding, or sharing.',
      categoryIds: ['text']
    },
    {
      id: 'converters-calculators',
      name: 'Converters & Calculators',
      description: 'Quick converters and calculators for percentages, units, currencies, time zones, timestamps, and everyday math — perfect for fast answers without spreadsheets.',
      categoryIds: ['math', 'converter']
    },
    {
      id: 'design-media-tools',
      name: 'Design & Media Tools',
      description: 'Creative utilities for working with images, icons, gradients, colors, and visual assets directly in the browser, with instant preview and export options.',
      categoryIds: ['image', 'ocr', 'music']
    }
  ];

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

    // Populate tools for each SEO category section
    this.seoCategorySections.forEach(section => {
      section.tools = this.allTools.filter(tool =>
        section.categoryIds.includes(tool.category)
      );
    });

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

    // Create WebPage + ItemList structured data
    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': 'https://www.allthethings.dev/tools',
          'url': 'https://www.allthethings.dev/tools',
          'name': 'Online Toolbox of Free Web Tools for Developers, Marketers, and Creators',
          'description': 'All The Tools is a one-stop online toolbox packed with fast, free web utilities for developers, marketers, and everyday creators.',
          'inLanguage': 'en-US',
          'isPartOf': {
            '@type': 'WebSite',
            'url': 'https://www.allthethings.dev',
            'name': 'All The Tools'
          }
        },
        {
          '@type': 'ItemList',
          'name': 'Free Online Tools',
          'description': 'A comprehensive collection of free web utilities',
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
