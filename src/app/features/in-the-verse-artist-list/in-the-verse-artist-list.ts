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
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ArtistPreview, ArtistVideo, PaginatedArtistResponse } from './models/artist.models';
import { ArtistsService } from './services/artists.service';
import { MetaService } from '../../core/services/meta.service';
import { StructuredDataService } from '../../core/services/structured-data.service';
import { PaginationComponent } from '../blog/components/pagination/pagination.component';
import { VideoDialogComponent } from './components/video-dialog/video-dialog.component';

/**
 * In The Verse Artist List Component
 * Displays paginated list of 3D artists
 */
@Component({
  selector: 'app-in-the-verse-artist-list',
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
  templateUrl: './in-the-verse-artist-list.html',
  styleUrl: './in-the-verse-artist-list.scss',
})
export class InTheVerseArtistList implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private artistsService = inject(ArtistsService);
  private metaService = inject(MetaService);
  private structuredDataService = inject(StructuredDataService);
  private destroyRef = inject(DestroyRef);
  private platformId = inject(PLATFORM_ID);
  private dialog = inject(MatDialog);

  artists: ArtistPreview[] = [];
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  pageSize = 12;
  loading = true;
  selectedKeyword: string | null = null;
  searchQuery = signal('');
  allArtists: ArtistPreview[] = [];
  filteredArtists = signal<ArtistPreview[]>([]);

  ngOnInit(): void {
    // Load all artists for search autocomplete
    this.artistsService.getArtistPreviews(1, 1000).subscribe({
      next: (response) => {
        this.allArtists = response.items;
      },
    });

    // Watch for query param changes
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.currentPage = Number(params['page']) || 1;
      this.selectedKeyword = params['keyword'] || null;
      const searchFromUrl = params['q'] || '';
      if (searchFromUrl !== this.searchQuery()) {
        this.searchQuery.set(searchFromUrl);
      }
      this.loadArtists();
    });

    this.updateMetaTags();
    this.addStructuredData();
  }

  private loadArtists(): void {
    this.loading = true;

    const filters: any = {};
    if (this.selectedKeyword) filters.keyword = this.selectedKeyword;
    if (this.searchQuery().trim()) filters.search = this.searchQuery().trim();

    this.artistsService
      .getArtistPreviews(this.currentPage, this.pageSize, filters)
      .subscribe({
        next: (response: PaginatedArtistResponse<ArtistPreview>) => {
          this.artists = response.items;
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
      title: 'In The Verse - 3D Artists Directory | All The Things',
      description:
        'Discover talented 3D artists, Blender creators, and digital sculptors. Browse our curated directory of artists creating stunning sci-fi, mecha, and environment art.',
      keywords: [
        '3D artists',
        'Blender artists',
        'digital art',
        'sci-fi art',
        'mecha design',
        '3D modeling',
        'CGI artists',
      ],
      image: 'https://www.allthethings.dev/in-the-verse/og-3d-artist-spotlight.jpg',
      url: this.artistsService.getListingUrl(this.currentPage),
      type: 'website',
    };

    this.metaService.updateTags(config);
  }

  private addStructuredData(): void {
    // Add breadcrumbs
    this.structuredDataService.addBreadcrumbs([
      { name: 'Home', url: 'https://www.allthethings.dev' },
      { name: '3D Artists', url: 'https://www.allthethings.dev/3d-artist-spotlight' },
    ]);
  }

  onPageChange(page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: page > 1 ? page : null,
        keyword: this.selectedKeyword,
        q: this.searchQuery().trim() || null,
      },
      queryParamsHandling: 'merge',
    });
  }

  filterByKeyword(keyword: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        keyword,
        page: null,
        q: null,
      },
    });
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
    });
  }

  private scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onSearchInput(value: string): void {
    this.searchQuery.set(value);

    if (value.trim() === '') {
      this.filteredArtists.set([]);
      return;
    }

    const query = value.toLowerCase();
    const filtered = this.allArtists.filter(artist =>
      artist.name.toLowerCase().includes(query) ||
      artist.shortDescription.toLowerCase().includes(query) ||
      artist.keywords.some(keyword => keyword.toLowerCase().includes(query))
    ).slice(0, 10);

    this.filteredArtists.set(filtered);
  }

  onSearchSubmit(): void {
    const query = this.searchQuery().trim();
    this.filteredArtists.set([]);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: query || null,
        page: null,
        keyword: null,
      },
    });
  }

  onArtistSelected(artist: ArtistPreview): void {
    this.searchQuery.set('');
    this.filteredArtists.set([]);
    this.router.navigate(['/3d-artist-spotlight', artist.slug]);
  }

  displayArtist(artist: ArtistPreview | null): string {
    return artist ? artist.name : '';
  }

  openVideoDialog(artist: ArtistPreview, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!artist.youtubeVideoId) return;

    // Build video array same as artist detail page
    const videos: ArtistVideo[] = [];

    // Add featured video first
    if (artist.youtubeVideoId) {
      videos.push({ id: artist.youtubeVideoId });
    }

    // Add additional videos from youtubeVideos array
    if (artist.youtubeVideos?.length) {
      videos.push(...artist.youtubeVideos);
    }

    this.dialog.open(VideoDialogComponent, {
      data: {
        videos,
        artistName: artist.name,
        startIndex: 0,
      },
      panelClass: 'video-dialog-panel',
      maxWidth: '90vw',
      maxHeight: '90vh',
    });
  }
}
