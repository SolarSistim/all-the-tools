import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { Resource, ResourcePreview } from '../../models/resource.models';
import { ResourcesService } from '../../services/resources.service';
import { MetaService } from '../../../../core/services/meta.service';
import { StructuredDataService } from '../../../../core/services/structured-data.service';

/**
 * Resource Page Component
 * Displays individual resource details with external link
 */
@Component({
  selector: 'app-resource-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
  ],
  templateUrl: './resource-page.component.html',
  styleUrls: ['./resource-page.component.scss'],
})
export class ResourcePageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private resourcesService = inject(ResourcesService);
  private metaService = inject(MetaService);
  private structuredDataService = inject(StructuredDataService);

  resource: Resource | null = null;
  relatedResources: ResourcePreview[] = [];
  resourcePageUrl = '';

  ngOnInit(): void {
    // Get resource from resolver
    const resource = this.route.snapshot.data['resource'] as Resource;

    if (resource) {
      console.log('[Resource Page] resource data:', resource);
      this.resource = resource;
      this.resourcePageUrl = this.resourcesService.getResourcePageUrl(resource.slug);
      this.updateMetaTags();
      this.addStructuredData();
      this.loadRelatedResources();
    }
  }

  private updateMetaTags(): void {
    if (!this.resource) return;

    // IMPORTANT: Individual resource pages do NOT have og:image
    const config = {
      title: `${this.resource.title} | Resources`,
      description: this.resource.metaDescription || this.resource.description,
      keywords: this.resource.metaKeywords || this.resource.tags,
      url: this.resourcePageUrl,
      type: 'website',
      // NO image property for individual resource pages
    };

    this.metaService.updateTags(config);
  }

  private addStructuredData(): void {
    if (!this.resource) return;

    // Add breadcrumbs
    this.structuredDataService.addBreadcrumbs([
      { name: 'Home', url: 'https://www.allthethings.dev' },
      { name: 'Resources', url: 'https://www.allthethings.dev/resources' },
      { name: this.resource.title, url: this.resourcePageUrl },
    ]);

    // Add webpage schema
    this.structuredDataService.addWebPage({
      name: this.resource.title,
      description: this.resource.description,
      url: this.resourcePageUrl,
    });
  }

  private loadRelatedResources(): void {
    if (!this.resource) return;

    this.resourcesService.getRelatedResources(this.resource, 3).subscribe({
      next: (related) => {
        this.relatedResources = related;
      },
    });
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

  visitResource(): void {
    if (this.resource) {
      window.open(this.resource.externalUrl, '_blank', 'noopener,noreferrer');
    }
  }
}
