import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {
  private readonly GA_ID = 'G-EN03BGVCWT';
  private isInitialized = false;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  /**
   * Initialize Google Analytics only in production (not localhost)
   */
  initialize(): void {
    // Only run in browser (not during SSR)
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Skip if already initialized
    if (this.isInitialized) {
      return;
    }

    // Check if we're running on localhost
    const isLocalhost = window.location.hostname === 'localhost' ||
                       window.location.hostname === '127.0.0.1';

    // Only load GA if NOT on localhost
    if (!isLocalhost) {
      this.loadGoogleAnalytics();
      this.isInitialized = true;
    }
  }

  private loadGoogleAnalytics(): void {
    // Load the Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.GA_ID}`;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]): void {
      (window as any).dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', this.GA_ID);
  }
}
