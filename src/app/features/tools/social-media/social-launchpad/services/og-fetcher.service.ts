import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError, TimeoutError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { OGFetchResponse } from '../models/platform.model';

@Injectable({
  providedIn: 'root'
})
export class OGFetcherService {
  private readonly NETLIFY_FUNCTION_URL = '/.netlify/functions/og-scraper';
  private readonly TIMEOUT_MS = 10000;

  constructor(private http: HttpClient) {}

  /**
   * Fetches OG data from a URL via the Netlify function
   */
  fetchOGData(url: string): Observable<OGFetchResponse> {
    if (!this.isValidUrl(url)) {
      return of({
        success: false,
        error: 'Invalid URL format'
      });
    }

    const encodedUrl = encodeURIComponent(url);
    const fetchUrl = `${this.NETLIFY_FUNCTION_URL}?url=${encodedUrl}`;

    return this.http.get<OGFetchResponse>(fetchUrl).pipe(
      timeout(this.TIMEOUT_MS),
      map(response => {
        // Ensure response has the expected structure
        if (response.success && response.data) {
          return response;
        } else {
          return {
            success: false,
            error: response.error || 'Failed to fetch OG data'
          };
        }
      }),
      catchError((error: any) => {
        console.error('OG fetch error:', error);

        if (error instanceof TimeoutError) {
          return of({
            success: false,
            error: 'Request timed out. Please try again.'
          });
        }

        if (error instanceof HttpErrorResponse) {
          if (error.status === 429) {
            return of({
              success: false,
              error: 'Rate limit exceeded. Please try again later.',
              retryAfter: error.error?.retryAfter || 60
            });
          }

          return of({
            success: false,
            error: error.error?.error || 'Failed to fetch OG data. Please check the URL and try again.'
          });
        }

        return of({
          success: false,
          error: 'An unexpected error occurred. Please try again.'
        });
      })
    );
  }

  /**
   * Validates URL format
   */
  private isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Extracts domain from URL for display
   */
  extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return '';
    }
  }

  /**
   * Checks if OG data is complete
   */
  isOGDataComplete(data: OGFetchResponse): boolean {
    return !!(
      data.success &&
      data.data?.title &&
      data.data?.description &&
      data.data?.image
    );
  }

  /**
   * Gets a fallback OG data object
   */
  getFallbackOGData(url: string): OGFetchResponse {
    return {
      success: true,
      data: {
        title: this.extractDomain(url),
        description: 'No description available',
        image: '',
        url: url
      }
    };
  }
}
