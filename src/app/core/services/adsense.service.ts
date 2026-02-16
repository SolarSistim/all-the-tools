import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdsenseService {
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService);
  private loaded = false;

  /**
   * Observable that determines if ads should be shown
   * Ads are shown when:
   * - environment.adsEnabled is true AND
   * - user is NOT authenticated (not logged in)
   */
  public shouldShowAds$: Observable<boolean> = this.authService.isAuthenticated$.pipe(
    map(isAuthenticated => environment.adsEnabled && !isAuthenticated)
  );

  init(): void {
    // Check if ads are globally disabled in environment
    if (!environment.adsEnabled || this.loaded || !isPlatformBrowser(this.platformId)) {
      return;
    }

    // If user is authenticated, don't load ad script
    // The script will be loaded on-demand when user logs out
    const isAuthenticated = this.authService.getCurrentUser() !== null;
    if (isAuthenticated) {
      return;
    }

    if (this.document.querySelector('script[data-adsense="true"]')) {
      this.loaded = true;
      return;
    }

    const script = this.document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7077792325295668';
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('data-adsense', 'true');
    this.document.head.appendChild(script);
    this.loaded = true;
  }

  /**
   * Check if ads should currently be shown (synchronous)
   */
  shouldShowAdsSync(): boolean {
    const isAuthenticated = this.authService.getCurrentUser() !== null;
    return environment.adsEnabled && !isAuthenticated;
  }
}
