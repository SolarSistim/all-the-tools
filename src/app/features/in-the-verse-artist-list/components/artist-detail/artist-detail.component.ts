import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Artist, ArtistPreview, ArtistVideo } from '../../models/artist.models';
import { ArtistsService } from '../../services/artists.service';
import { MetaService } from '../../../../core/services/meta.service';
import { StructuredDataService } from '../../../../core/services/structured-data.service';
import { VideoDialogComponent } from '../video-dialog/video-dialog.component';

/**
 * Artist Detail Component
 * Displays individual artist details with video embed and links
 */
@Component({
  selector: 'app-artist-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
  ],
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.scss'],
})
export class ArtistDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private artistsService = inject(ArtistsService);
  private metaService = inject(MetaService);
  private structuredDataService = inject(StructuredDataService);
  private sanitizer = inject(DomSanitizer);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);

  artist: Artist | null = null;
  relatedArtists: ArtistPreview[] = [];
  artistPageUrl = '';
  videoEmbedUrl: SafeResourceUrl | null = null;
  allVideos: ArtistVideo[] = [];

  ngOnInit(): void {
    // Subscribe to route data changes to handle navigation between artists
    this.route.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      const artist = data['artist'] as Artist;

      if (artist) {
        this.artist = artist;
        this.artistPageUrl = this.artistsService.getArtistPageUrl(artist.slug);
        this.updateMetaTags();
        this.addStructuredData();
        this.loadRelatedArtists();
        this.buildVideoEmbedUrl();
        this.buildAllVideos();
      }
    });
  }

  private updateMetaTags(): void {
    if (!this.artist) return;

    const config = {
      title: `${this.artist.name} | 3D Artists Directory`,
      description: this.artist.metaDescription || this.artist.shortDescription,
      keywords: this.artist.metaKeywords || this.artist.keywords,
      image: this.artist.ogImage || this.artistsService.getConfig().defaultOgImage,
      url: this.artistPageUrl,
      type: 'profile',
    };

    this.metaService.updateTags(config);
  }

  private addStructuredData(): void {
    if (!this.artist) return;

    // Add breadcrumbs
    this.structuredDataService.addBreadcrumbs([
      { name: 'Home', url: 'https://www.allthethings.dev' },
      { name: '3D Artists', url: 'https://www.allthethings.dev/3d-artist-spotlight' },
      { name: this.artist.name, url: this.artistPageUrl },
    ]);

    // Add webpage schema
    this.structuredDataService.addWebPage({
      name: this.artist.name,
      description: this.artist.shortDescription,
      url: this.artistPageUrl,
    });
  }

  private loadRelatedArtists(): void {
    if (!this.artist) return;

    this.artistsService.getRelatedArtists(this.artist, 3).subscribe({
      next: (related) => {
        this.relatedArtists = related;
      },
    });
  }

  private buildVideoEmbedUrl(): void {
    if (!this.artist?.youtubeVideoId) {
      this.videoEmbedUrl = null;
      return;
    }

    const embedUrl = `https://www.youtube.com/embed/${this.artist.youtubeVideoId}`;
    this.videoEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  getLinkIcon(linkType: string): string {
    switch (linkType) {
      case 'website':
        return 'language';
      case 'artstation':
        return 'palette';
      case 'instagram':
        return 'photo_camera';
      case 'twitter':
        return 'tag';
      case 'youtube':
        return 'play_circle';
      case 'behance':
        return 'brush';
      case 'linkedin':
        return 'work';
      case 'blendermarket':
        return 'shopping_cart';
      case 'gumroad':
        return 'store';
      case 'patreon':
        return 'favorite';
      default:
        return 'link';
    }
  }

  getLinkLabel(linkType: string): string {
    switch (linkType) {
      case 'website':
        return 'Website';
      case 'artstation':
        return 'ArtStation';
      case 'instagram':
        return 'Instagram';
      case 'twitter':
        return 'X (Twitter)';
      case 'youtube':
        return 'YouTube';
      case 'behance':
        return 'Behance';
      case 'linkedin':
        return 'LinkedIn';
      case 'blendermarket':
        return 'Blender Market';
      case 'gumroad':
        return 'Gumroad';
      case 'patreon':
        return 'Patreon';
      default:
        return linkType;
    }
  }

  getLinksArray(): { type: string; url: string }[] {
    if (!this.artist?.links) return [];

    return Object.entries(this.artist.links)
      .filter(([_, url]) => url)
      .map(([type, url]) => ({ type, url: url as string }));
  }

  private buildAllVideos(): void {
    if (!this.artist) {
      this.allVideos = [];
      return;
    }

    const videos: ArtistVideo[] = [];

    // Add featured video first if it exists
    if (this.artist.youtubeVideoId) {
      videos.push({
        id: this.artist.youtubeVideoId,
      });
    }

    // Add additional videos from youtubeVideos array
    if (this.artist.youtubeVideos?.length) {
      videos.push(...this.artist.youtubeVideos);
    }

    this.allVideos = videos;
  }

  getVideoThumbnail(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  }

  openVideoDialog(startIndex: number): void {
    if (this.allVideos.length === 0 || !this.artist) return;

    this.dialog.open(VideoDialogComponent, {
      data: {
        videos: this.allVideos,
        artistName: this.artist.name,
        startIndex,
      },
      panelClass: 'video-dialog-panel',
      maxWidth: '90vw',
      maxHeight: '90vh',
    });
  }
}
