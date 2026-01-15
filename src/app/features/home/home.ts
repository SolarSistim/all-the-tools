import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ToolsService } from '../../core/services/tools.service';
import { MetaService } from '../../core/services/meta.service';
import { StructuredDataService } from '../../core/services/structured-data.service';
import { Tool, ToolCategoryMeta } from '../../core/models/tool.interface';
import { ToolCardComponent } from '../../shared/components/tool-card/tool-card';
import { CtaEmailList } from '../reusable-components/cta-email-list/cta-email-list';
import { BlogService } from '../blog/services/blog.service';
import { ArticlePreview } from '../blog/models/blog.models';
import { ResourcesService } from '../resources/services/resources.service';
import { ResourcePreview } from '../resources/models/resource.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    ToolCardComponent,
    CtaEmailList
],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  toolsService = inject(ToolsService);
  private metaService = inject(MetaService);
  private structuredData = inject(StructuredDataService);
  private blogService = inject(BlogService);
  private resourcesService = inject(ResourcesService);

  featuredTools: Tool[] = [];
  categories: ToolCategoryMeta[] = [];
  recentArticles: ArticlePreview[] = [];
  recentResources: ResourcePreview[] = [];

  // Icon pool for hero visual grid
  private iconPool = [
    'calculate', 'text_fields', 'palette', 'swap_horiz',
    'password', 'qr_code', 'schedule', 'percent',
    'thermostat', 'gradient', 'fingerprint', 'notes'
  ];

  // Value propositions
  benefits = [
    {
      icon: 'lock',
      title: '100% Private',
      description: 'All tools run entirely in your browser. No data is ever sent to any server.'
    },
    {
      icon: 'flash_on',
      title: 'Lightning Fast',
      description: 'Instant results with no loading times. Pure client-side performance.'
    },
    {
      icon: 'smartphone',
      title: 'Mobile Friendly',
      description: 'Responsive design that works beautifully on all devices and screen sizes.'
    },
    {
      icon: 'money_off',
      title: 'Always Free',
      description: 'No subscriptions, no ads, no hidden costs. Free forever.'
    }
  ];

  ngOnInit(): void {
    this.metaService.updateTags({
      title: 'All The Things - Your Swiss Army Knife of Web Utilities',
      description: 'Free online tools for text, images, developers, and more. Word counter, case converter, percentage calculator, QR code generator, and 20+ other utilities. Fast, private, and always free.',
      keywords: ['online tools', 'web utilities', 'free tools', 'text tools', 'calculators', 'converters', 'generators', 'developer tools'],
      image: 'https://www.allthethings.dev/meta-images/og-home.png',
      url: 'https://www.allthethings.dev/'
    });

    // Add structured data for homepage
    this.structuredData.addOrganization();

    // Get 6 random featured tools
    const allFeaturedTools = this.toolsService.getFeaturedTools();
    this.featuredTools = this.getRandomItems(allFeaturedTools, 6);

    // Get 4 random categories (only those with tools)
    const allCategories = this.toolsService.getAllCategories();
    const categoriesWithTools = allCategories.filter(cat => this.getToolCountForCategory(cat.id) > 0);
    this.categories = this.getRandomItems(categoriesWithTools, 4);

    // Load recent blog articles
    this.blogService.getRecentArticles(3).subscribe({
      next: (articles) => {
        this.recentArticles = articles;
      }
    });

    // Load recent resources
    this.resourcesService.getResourcePreviews(1, 4).subscribe({
      next: (response) => {
        this.recentResources = response.items;
      }
    });
  }

  getToolCountForCategory(categoryId: string): number {
    return this.toolsService.getToolCountByCategory(categoryId as any);
  }

  getRandomIcon(index: number): string {
    return this.iconPool[index % this.iconPool.length];
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getDifficultyColor(difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'easy' | 'N/A'): string {
    switch (difficulty) {
      case 'beginner':
        return '#4caf50';
      case 'easy':
        return '#8bc34a';
      case 'intermediate':
        return '#ff9800';
      case 'advanced':
        return '#f44336';
      case 'N/A':
        return '#9e9e9e';
      default:
        return '#757575';
    }
  }

  /**
   * Get random items from an array
   * Uses Fisher-Yates shuffle algorithm for unbiased random selection
   */
  private getRandomItems<T>(array: T[], count: number): T[] {
    if (array.length <= count) {
      return array;
    }

    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, count);
  }
}
