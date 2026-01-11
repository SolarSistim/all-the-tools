import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SpotifyAuthService } from './spotify-auth.service';

export interface SpotifyPlaylist {
  id: string;
  name: string;
  tracks: {
    total: number;
  };
  images: { url: string }[];
}

export interface SpotifyTrack {
  track: {
    name: string;
    artists: { name: string }[];
    album: {
      name: string;
    };
    duration_ms: number;
    external_urls: {
      spotify: string;
    };
    uri: string;
  };
  added_at: string;
}

export interface PlaylistTracksResponse {
  items: SpotifyTrack[];
  next: string | null;
  total: number;
}

export interface PlaylistsResponse {
  items: SpotifyPlaylist[];
  next: string | null;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class SpotifyApiService {
  private readonly API_BASE = 'https://api.spotify.com/v1';

  constructor(
    private http: HttpClient,
    private authService: SpotifyAuthService
  ) {}

  async getUserPlaylists(): Promise<SpotifyPlaylist[]> {
    const allPlaylists: SpotifyPlaylist[] = [];
    let url: string | null = `${this.API_BASE}/me/playlists?limit=50`;

    while (url) {
      const response: PlaylistsResponse = await this.makeRequest<PlaylistsResponse>(url);
      allPlaylists.push(...response.items);
      url = response.next;
    }

    return allPlaylists;
  }

  async getPlaylistTracks(playlistId: string): Promise<SpotifyTrack[]> {
    const allTracks: SpotifyTrack[] = [];
    let url: string | null = `${this.API_BASE}/playlists/${playlistId}/tracks?limit=100`;

    while (url) {
      const response: PlaylistTracksResponse = await this.makeRequest<PlaylistTracksResponse>(url);
      allTracks.push(...response.items);
      url = response.next;
    }

    return allTracks;
  }

  private async makeRequest<T>(url: string): Promise<T> {
    const token = this.authService.getAccessToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      return await this.http.get<T>(url, { headers }).toPromise() as T;
    } catch (error: any) {
      if (error.status === 401) {
        this.authService.disconnect();
        throw new Error('Token expired. Please reconnect.');
      }
      throw error;
    }
  }
}
