import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyAuthService {
  private readonly SPOTIFY_CLIENT_ID = 'YOUR_SPOTIFY_CLIENT_ID';
  private readonly REDIRECT_URI = window.location.origin + '/tools/spotify/callback';
  private readonly TOKEN_KEY = 'spotify_access_token';
  private readonly EXPIRY_KEY = 'spotify_token_expires_at';
  private readonly VERIFIER_KEY = 'spotify_code_verifier';
  private readonly STATE_KEY = 'spotify_auth_state';

  constructor(private http: HttpClient) {}

  async initiateAuth(): Promise<void> {
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    const state = this.generateRandomString(16);

    localStorage.setItem(this.VERIFIER_KEY, codeVerifier);
    localStorage.setItem(this.STATE_KEY, state);

    const scopes = ['playlist-read-private', 'playlist-read-collaborative'];
    const authUrl = new URL('https://accounts.spotify.com/authorize');

    authUrl.searchParams.append('client_id', this.SPOTIFY_CLIENT_ID);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('redirect_uri', this.REDIRECT_URI);
    authUrl.searchParams.append('code_challenge_method', 'S256');
    authUrl.searchParams.append('code_challenge', codeChallenge);
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('scope', scopes.join(' '));

    window.location.href = authUrl.toString();
  }

  async handleCallback(code: string, state: string): Promise<void> {
    const storedState = localStorage.getItem(this.STATE_KEY);
    if (state !== storedState) {
      throw new Error('State mismatch - possible CSRF attack');
    }

    const codeVerifier = localStorage.getItem(this.VERIFIER_KEY);
    if (!codeVerifier) {
      throw new Error('Code verifier not found');
    }

    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const body = new URLSearchParams({
      client_id: this.SPOTIFY_CLIENT_ID,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.REDIRECT_URI,
      code_verifier: codeVerifier
    });

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    try {
      const response: any = await this.http.post(tokenUrl, body.toString(), { headers }).toPromise();

      const expiresAt = Date.now() + (response.expires_in * 1000);
      localStorage.setItem(this.TOKEN_KEY, response.access_token);
      localStorage.setItem(this.EXPIRY_KEY, expiresAt.toString());

      localStorage.removeItem(this.VERIFIER_KEY);
      localStorage.removeItem(this.STATE_KEY);
    } catch (error) {
      console.error('Token exchange failed:', error);
      throw error;
    }
  }

  getAccessToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const expiryStr = localStorage.getItem(this.EXPIRY_KEY);

    if (!token || !expiryStr) {
      return null;
    }

    const expiry = parseInt(expiryStr, 10);
    if (Date.now() >= expiry) {
      this.disconnect();
      return null;
    }

    return token;
  }

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }

  disconnect(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EXPIRY_KEY);
    localStorage.removeItem(this.VERIFIER_KEY);
    localStorage.removeItem(this.STATE_KEY);
  }

  private generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return this.base64UrlEncode(array);
  }

  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return this.base64UrlEncode(new Uint8Array(hash));
  }

  private base64UrlEncode(array: Uint8Array): string {
    const base64 = btoa(String.fromCharCode(...array));
    return base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  private generateRandomString(length: number): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}
