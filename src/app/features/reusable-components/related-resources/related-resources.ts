import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ResourcePreview } from '../../../features/resources/models/resource.models';
import { ResourcesService } from '../../../features/resources/services/resources.service';
import { ContentMatchingService } from '../../../core/services/content-matching.service';

/**
 * Related Resources Component
 * Displays related external resources inline within article content
 * Supports both explicit resource IDs and automatic tag-based matching
 */
@Component({
  selector: 'app-related-resources',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './related-resources.html',
  styleUrl: './related-resources.scss',
})
export class RelatedResourcesComponent implements OnInit {
  @Input() resourceIds?: string[];
  @Input() auto = false;
  @Input() limit = 3;
  @Input() title = 'Related Resources';
  @Input() currentArticleTags?: string[];

  displayResources: ResourcePreview[] = [];

  constructor(
    private resourcesService: ResourcesService,
    private contentMatchingService: ContentMatchingService
  ) {}

  ngOnInit(): void {
    if (this.resourceIds && this.resourceIds.length > 0) {
      // Use explicit resource IDs
      this.loadExplicitResources();
    } else if (this.auto && this.currentArticleTags) {
      // Auto-generate based on tags
      this.loadAutoResources();
    }
  }

  private loadExplicitResources(): void {
    if (!this.resourceIds) return;

    // Load each resource by ID
    this.resourceIds.forEach(id => {
      this.resourcesService.getResourceById(id).subscribe(resource => {
        if (resource) {
          this.displayResources.push(resource as ResourcePreview);
        }
      });
    });
  }

  private loadAutoResources(): void {
    if (!this.currentArticleTags) return;

    this.contentMatchingService.findRelatedResources(
      this.currentArticleTags,
      this.limit
    ).subscribe(resources => {
      this.displayResources = resources;
    });
  }
}
