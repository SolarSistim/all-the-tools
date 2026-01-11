import { Component, OnInit, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { SpotifyAuthService } from './spotify-auth.service';
import { SpotifyApiService, SpotifyPlaylist, SpotifyTrack } from './spotify-api.service';
import { AlertPrimary } from '../../../reusable-components/alerts/alert-primary/alert-primary';

type AppState = 'unauthenticated' | 'authenticated' | 'loading-playlists' | 'playlists-loaded' | 'loading-tracks' | 'error';

@Component({
  selector: 'app-spotify-playlist-exporter',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatListModule,
    AlertPrimary
  ],
  templateUrl: './spotify-playlist-exporter.html',
  styleUrl: './spotify-playlist-exporter.scss',
})
export class SpotifyPlaylistExporter implements OnInit {
  @ViewChild('exportSection') exportSection!: ElementRef;

  state = signal<AppState>('unauthenticated');
  playlists = signal<SpotifyPlaylist[]>([]);
  selectedPlaylist = signal<SpotifyPlaylist | null>(null);
  tracks = signal<SpotifyTrack[]>([]);
  errorMessage = signal<string>('');

  constructor(
    private authService: SpotifyAuthService,
    private apiService: SpotifyApiService
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.state.set('authenticated');
    }
  }

  async connectSpotify(): Promise<void> {
    try {
      await this.authService.initiateAuth();
    } catch (error) {
      this.state.set('error');
      this.errorMessage.set('Failed to initiate Spotify authentication');
    }
  }

  disconnect(): void {
    this.authService.disconnect();
    this.state.set('unauthenticated');
    this.playlists.set([]);
    this.selectedPlaylist.set(null);
    this.tracks.set([]);
  }

  async loadPlaylists(): Promise<void> {
    this.state.set('loading-playlists');
    this.errorMessage.set('');

    try {
      const playlists = await this.apiService.getUserPlaylists();
      this.playlists.set(playlists);
      this.state.set('playlists-loaded');
    } catch (error: any) {
      this.state.set('error');
      this.errorMessage.set(error.message || 'Failed to load playlists. Please try reconnecting.');
    }
  }

  selectPlaylist(playlist: SpotifyPlaylist): void {
    this.selectedPlaylist.set(playlist);
    this.tracks.set([]);
    this.loadPlaylistTracks(playlist.id);
  }

  private async loadPlaylistTracks(playlistId: string): Promise<void> {
    this.state.set('loading-tracks');
    this.errorMessage.set('');

    try {
      const tracks = await this.apiService.getPlaylistTracks(playlistId);
      this.tracks.set(tracks);
      this.state.set('playlists-loaded');
    } catch (error: any) {
      this.state.set('error');
      this.errorMessage.set(error.message || 'Failed to load playlist tracks');
    }
  }

  downloadCSV(): void {
    const playlist = this.selectedPlaylist();
    const tracks = this.tracks();

    if (!playlist || tracks.length === 0) {
      return;
    }

    const headers = ['Playlist Name', 'Track Name', 'Artists', 'Album', 'Added At', 'Duration (ms)', 'Spotify URL', 'URI'];
    const rows = tracks.map(item => {
      const track = item.track;
      const artists = track.artists.map(a => a.name).join('; ');

      return [
        this.escapeCSV(playlist.name),
        this.escapeCSV(track.name),
        this.escapeCSV(artists),
        this.escapeCSV(track.album.name),
        this.escapeCSV(item.added_at),
        track.duration_ms.toString(),
        this.escapeCSV(track.external_urls.spotify),
        this.escapeCSV(track.uri)
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    this.downloadFile(csvContent, `${playlist.name}_tracks.csv`, 'text/csv');
  }

  downloadTXT(): void {
    const playlist = this.selectedPlaylist();
    const tracks = this.tracks();

    if (!playlist || tracks.length === 0) {
      return;
    }

    const lines = tracks.map(item => {
      const track = item.track;
      const artists = track.artists.map(a => a.name).join(', ');
      return `${track.name} — ${artists} (${track.album.name}) | ${track.external_urls.spotify}`;
    });

    const txtContent = lines.join('\n');
    this.downloadFile(txtContent, `${playlist.name}_tracks.txt`, 'text/plain');
  }

  private escapeCSV(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  scrollToExport(): void {
    if (this.exportSection) {
      this.exportSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  getArtistNames(track: SpotifyTrack): string {
    return track.track.artists.map(a => a.name).join(', ');
  }
}
