import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError, TimeoutError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { OGFetchResponse } from '../models/platform.model';
import { environment } from '../../../../../../environments/environment';
import { VisitLoggerService } from '../../../../../../core/services/visit-logger.service';

interface UserRateLimitData {
  requestTimestamps: number[];
  lockedUntil?: number;
}

@Injectable({
  providedIn: 'root'
})
export class OGFetcherService {
  private readonly NETLIFY_FUNCTION_URL = '/.netlify/functions/og-scraper';
  private readonly TIMEOUT_MS = 10000;
  private readonly RATE_LIMIT_STORAGE_KEY = 'og-fetch-user-rate-limit';
  private readonly USER_LIMIT_PER_MIN = environment.ogFetchUserLimitPerMin;
  private readonly LOCKOUT_MINUTES = environment.ogFetchUserLockoutMinutes;

  constructor(
    private http: HttpClient,
    private visitLogger: VisitLoggerService
  ) { }

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

    // Check user rate limit
    const rateLimitCheck = this.checkUserRateLimit();
    if (!rateLimitCheck.allowed) {
      return of({
        success: false,
        error: rateLimitCheck.error,
        lockedUntil: rateLimitCheck.lockedUntil
      });
    }

    // Record this request
    this.recordUserRequest();

    const encodedUrl = encodeURIComponent(url);

    // Collect logging metadata
    const metadata = {
      url: encodedUrl,
      sessionId: this.visitLogger.sessionId,
      deviceType: this.visitLogger.getDeviceType(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      screenResolution: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : 'Unknown',
      language: typeof navigator !== 'undefined' ? navigator.language : 'Unknown',
      referrer: typeof document !== 'undefined' ? document.referrer : 'Direct'
    };

    const fetchUrl = `${this.NETLIFY_FUNCTION_URL}?url=${metadata.url}` +
      `&sessionId=${encodeURIComponent(metadata.sessionId)}` +
      `&deviceType=${encodeURIComponent(metadata.deviceType)}` +
      `&userAgent=${encodeURIComponent(metadata.userAgent)}` +
      `&screenResolution=${encodeURIComponent(metadata.screenResolution)}` +
      `&language=${encodeURIComponent(metadata.language)}` +
      `&referrer=${encodeURIComponent(metadata.referrer)}`;

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
              retryAfter: error.error?.retryAfter || 60,
              queuePosition: error.error?.queuePosition
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
   * Gets user rate limit data from localStorage
   */
  private getUserRateLimitData(): UserRateLimitData {
    try {
      const data = localStorage.getItem(this.RATE_LIMIT_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error reading rate limit data:', error);
    }
    return { requestTimestamps: [] };
  }

  /**
   * Saves user rate limit data to localStorage
   */
  private saveUserRateLimitData(data: UserRateLimitData): void {
    try {
      localStorage.setItem(this.RATE_LIMIT_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving rate limit data:', error);
    }
  }

  /**
   * Checks if user is within rate limits
   */
  private checkUserRateLimit(): { allowed: boolean; error?: string; lockedUntil?: number } {
    const now = Date.now();
    const data = this.getUserRateLimitData();

    // Check if user is locked out
    if (data.lockedUntil && now < data.lockedUntil) {
      const remainingMinutes = Math.ceil((data.lockedUntil - now) / (1000 * 60));
      return {
        allowed: false,
        error: `You have been temporarily locked out for exceeding the request limit. Please try again in ${remainingMinutes} minute(s).`,
        lockedUntil: data.lockedUntil
      };
    }

    // Clear lockout if expired
    if (data.lockedUntil && now >= data.lockedUntil) {
      data.lockedUntil = undefined;
      data.requestTimestamps = [];
      this.saveUserRateLimitData(data);
    }

    // Remove timestamps older than 1 minute
    const oneMinuteAgo = now - (60 * 1000);
    data.requestTimestamps = data.requestTimestamps.filter(ts => ts > oneMinuteAgo);

    // Check if user has exceeded limit
    if (data.requestTimestamps.length >= this.USER_LIMIT_PER_MIN) {
      // Lock user out for specified minutes
      data.lockedUntil = now + (this.LOCKOUT_MINUTES * 60 * 1000);
      this.saveUserRateLimitData(data);

      return {
        allowed: false,
        error: `You have exceeded the limit of ${this.USER_LIMIT_PER_MIN} requests per minute. Please try again in a few minutes.`,
        lockedUntil: data.lockedUntil
      };
    }

    return { allowed: true };
  }

  /**
   * Records a user request timestamp
   */
  private recordUserRequest(): void {
    const now = Date.now();
    const data = this.getUserRateLimitData();

    // Remove timestamps older than 1 minute
    const oneMinuteAgo = now - (60 * 1000);
    data.requestTimestamps = data.requestTimestamps.filter(ts => ts > oneMinuteAgo);

    // Add current timestamp
    data.requestTimestamps.push(now);
    this.saveUserRateLimitData(data);
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

  /**
   * Clears the user rate limit data (for testing or admin purposes)
   */
  clearUserRateLimit(): void {
    try {
      localStorage.removeItem(this.RATE_LIMIT_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing rate limit data:', error);
    }
  }

  /**
   * Gets the remaining lockout time in milliseconds (0 if not locked)
   */
  getRemainingLockoutTime(): number {
    const data = this.getUserRateLimitData();
    if (data.lockedUntil) {
      const remaining = data.lockedUntil - Date.now();
      return remaining > 0 ? remaining : 0;
    }
    return 0;
  }
}
