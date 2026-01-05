import { Component, OnInit, inject, DestroyRef, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ResourcePreview, PaginatedResponse, ViewMode } from '../../models/resource.models';
import { ResourcesService } from '../../services/resources.service';
import { MetaService } from '../../../../core/services/meta.service';
import { StructuredDataService } from '../../../../core/services/structured-data.service';
import { PaginationComponent } from '../../../blog/components/pagination/pagination.component';

/**
 * Resources Listing Component
 * Displays paginated list of developer resources
 */
@Component({
  selector: 'app-resources-listing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatTooltipModule,
    FormsModule,
    PaginationComponent,
  ],
  templateUrl: './resources-listing.component.html',
  styleUrls: ['./resources-listing.component.scss'],
})
export class ResourcesListingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private resourcesService = inject(ResourcesService);
  private metaService = inject(MetaService);
  private structuredDataService = inject(StructuredDataService);
  private destroyRef = inject(DestroyRef);
  private platformId = inject(PLATFORM_ID);

  resources: ResourcePreview[] = [];
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  pageSize = 21;
  loading = true;
  selectedCategory: string | null = null;
  selectedTag: string | null = null;
  searchQuery = signal('');
  allResources: ResourcePreview[] = [];
  filteredResources = signal<ResourcePreview[]>([]);
  viewMode: ViewMode = 'tile-4';

  ngOnInit(): void {
    // Load view mode from localStorage (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      const savedViewMode = localStorage.getItem('resources-view-mode');
      if (this.isValidViewMode(savedViewMode)) {
        this.viewMode = savedViewMode as ViewMode;
      }
    }

    // Load all resources for search autocomplete
    this.resourcesService.getResourcePreviews(1, 1000).subscribe({
      next: (response) => {
        this.allResources = response.items;
      },
    });

    // Watch for query param changes
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.currentPage = Number(params['page']) || 1;
      this.selectedCategory = params['category'] || null;
      this.selectedTag = params['tag'] || null;
      this.loadResources();
    });

    this.updateMetaTags();
    this.addStructuredData();
  }

  private isValidViewMode(mode: string | null): boolean {
    return mode === 'tile-4' || mode === 'list';
  }

  private loadResources(): void {
    this.loading = true;

    const filters: any = {};
    if (this.selectedCategory) filters.category = this.selectedCategory;
    if (this.selectedTag) filters.tag = this.selectedTag;

    this.resourcesService
      .getResourcePreviews(this.currentPage, this.pageSize, filters)
      .subscribe({
        next: (response: PaginatedResponse<ResourcePreview>) => {
          this.resources = response.items;
          this.totalPages = response.totalPages;
          this.totalItems = response.totalItems;
          this.loading = false;
          this.scrollToTop();
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  private updateMetaTags(): void {
    const config = {
      title: 'Resources | All The Things',
      description:
        'Curated collection of developer resources, tools, documentation, and learning materials for web development.',
      keywords: [
        'developer resources',
        'web development tools',
        'documentation',
        'learning resources',
        'programming tools',
      ],
      image: this.resourcesService.getConfig().defaultOgImage,
      url: this.resourcesService.getListingUrl(this.currentPage),
      type: 'website',
    };

    this.metaService.updateTags(config);
  }

  private addStructuredData(): void {
    // Add breadcrumbs
    this.structuredDataService.addBreadcrumbs([
      { name: 'Home', url: 'https://www.allthethings.dev' },
      { name: 'Resources', url: 'https://www.allthethings.dev/resources' },
    ]);
  }

  onPageChange(page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: page > 1 ? page : null,
        category: this.selectedCategory,
        tag: this.selectedTag,
      },
      queryParamsHandling: 'merge',
    });
  }

  filterByCategory(category: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        category,
        page: null,
        tag: null,
      },
    });
  }

  filterByTag(tag: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        tag,
        page: null,
        category: null,
      },
    });
  }

  clearFilters(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
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

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSearchInput(value: string): void {
    this.searchQuery.set(value);

    if (value.trim() === '') {
      this.filteredResources.set([]);
      return;
    }

    const query = value.toLowerCase();
    const filtered = this.allResources.filter(resource =>
      resource.title.toLowerCase().includes(query) ||
      resource.description.toLowerCase().includes(query) ||
      resource.subtitle.toLowerCase().includes(query) ||
      resource.tags.some(tag => tag.toLowerCase().includes(query))
    ).slice(0, 10); // Limit to 10 results

    this.filteredResources.set(filtered);
  }

  onResourceSelected(resource: ResourcePreview): void {
    this.searchQuery.set('');
    this.filteredResources.set([]);
    this.router.navigate(['/resources', resource.slug]);
  }

  displayResource(resource: ResourcePreview | null): string {
    return resource ? resource.title : '';
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('resources-view-mode', mode);
    }
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
}
