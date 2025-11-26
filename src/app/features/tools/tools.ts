import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  allTools: Tool[] = [];
  filteredTools: Tool[] = [];
  categories: ToolCategoryMeta[] = [];
  searchQuery = signal('');
  selectedCategory = signal<string | null>(null);

  ngOnInit(): void {
    this.metaService.updateTags({
      title: 'Browse All Tools - 20+ Free Online Utilities | All The Tools',
      description: 'Explore our complete collection of free online tools. Text tools, image tools, developer tools, and more. No sign-up required.',
      keywords: ['online tools', 'web tools', 'free utilities', 'text tools', 'calculators', 'converters', 'generators'],
      image: 'https://all-the-tools.netlify.app/assets/meta-images/og-tools.png',
      url: 'https://all-the-tools.netlify.app/tools'
    });

    this.allTools = this.toolsService.getAvailableTools();
    this.filteredTools = this.allTools;
    this.categories = this.toolsService.getAllCategories();

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
}
