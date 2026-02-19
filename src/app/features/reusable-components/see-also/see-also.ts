import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';
import { Tool } from '../../../core/models/tool.interface';
import { ArticlePreview } from '../../../features/blog/models/blog.models';
import { ResourcePreview } from '../../../features/resources/models/resource.models';
import { ToolsService } from '../../../core/services/tools.service';
import { BlogService } from '../../../features/blog/services/blog.service';
import { ResourcesService } from '../../../features/resources/services/resources.service';

export interface SeeAlsoItem {
  type: 'tool' | 'article' | 'resource';
  id: string;
  customText?: string;
}

export interface SeeAlsoDisplayItem {
  type: 'tool' | 'article' | 'resource';
  title: string;
  url: string;
  icon: string;
  isExternal: boolean;
}

/**
 * See Also Component
 * Displays mixed content type links (tools, articles, resources)
 * Flexible component for creating curated "See Also" sections
 */
@Component({
  selector: 'app-see-also',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './see-also.html',
  styleUrl: './see-also.scss',
})
export class SeeAlsoComponent implements OnInit {
  @Input() title = 'See Also';
  @Input({ required: true }) items: SeeAlsoItem[] = [];

  displayItems: SeeAlsoDisplayItem[] = [];

  constructor(
    private toolsService: ToolsService,
    private blogService: BlogService,
    private resourcesService: ResourcesService
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  private loadItems(): void {
    if (!this.items || this.items.length === 0) {
      return;
    }

    // Group items by type for efficient loading
    const toolIds = this.items.filter(item => item.type === 'tool').map(item => item.id);
    const articleIds = this.items.filter(item => item.type === 'article').map(item => item.id);
    const resourceIds = this.items.filter(item => item.type === 'resource').map(item => item.id);

    // Load all items in parallel
    const observables: any[] = [];

    // Load tools
    toolIds.forEach(id => {
      const tool = this.toolsService.getToolById(id);
      if (tool) {
        const item = this.items.find(i => i.id === id);
        this.displayItems.push({
          type: 'tool',
          title: item?.customText || tool.name,
          url: `/tools/${tool.route}`,
          icon: tool.icon,
          isExternal: false
        });
      }
    });

    // Load articles
    articleIds.forEach(id => {
      observables.push(
        this.blogService.getArticleById(id)
      );
    });

    // Load resources
    resourceIds.forEach(id => {
      observables.push(
        this.resourcesService.getResourceById(id)
      );
    });

    // Subscribe to all observables
    if (observables.length > 0) {
      forkJoin(observables).subscribe(results => {
        results.forEach((result, index) => {
          if (!result) return;

          // Determine type based on result properties
          if ('content' in result) {
            // Article
            const article = result as ArticlePreview;
            const item = this.items.find(i => i.id === article.id);
            this.displayItems.push({
              type: 'article',
              title: item?.customText || article.title,
              url: `/blog/${article.slug}`,
              icon: 'article',
              isExternal: false
            });
          } else if ('externalUrl' in result) {
            // Resource
            const resource = result as ResourcePreview;
            const item = this.items.find(i => i.id === resource.id);
            this.displayItems.push({
              type: 'resource',
              title: item?.customText || resource.title,
              url: resource.externalUrl ?? '',
              icon: 'library_books',
              isExternal: true
            });
          }
        });

        // Sort display items to match the original order
        this.displayItems = this.items
          .map(item => this.displayItems.find(di =>
            (item.customText && di.title === item.customText) ||
            this.displayItems.find(d => d.url.includes(item.id))
          ))
          .filter((item): item is SeeAlsoDisplayItem => item !== undefined);
      });
    }
  }
}
