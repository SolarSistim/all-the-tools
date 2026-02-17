import { Component, Input, AfterViewInit, inject, PLATFORM_ID, isDevMode } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { AdsenseService } from '../../../../core/services/adsense.service';

/**
 * AdSense Component
 * Displays Google AdSense ads within article content
 * Shows a placeholder in development mode
 * Hides ads for authenticated users (ad-free experience)
 */
@Component({
  selector: 'app-adsense',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './adsense.component.html',
  styleUrls: ['./adsense.component.scss'],
})
export class AdsenseComponent implements AfterViewInit {
  private adsenseService = inject(AdsenseService);
  private platformId = inject(PLATFORM_ID);

  @Input() adClient: string = 'ca-pub-7077792325295668';
  @Input() adSlot: string = '3887470191';
  @Input() adFormat: string = 'auto';
  @Input() fullWidthResponsive: string = 'true';

  // Check if we're in development mode
  isDevelopment = isDevMode();

  // Observable to determine if ads should be shown (auth-aware)
  shouldShowAds$: Observable<boolean> = this.adsenseService.shouldShowAds$;

  ngAfterViewInit(): void {
    // Only initialize ads in production mode and if they should be shown
    if (!this.isDevelopment && isPlatformBrowser(this.platformId)) {
      // Check if ads should be shown synchronously
      const shouldShow = this.adsenseService.shouldShowAdsSync();

      if (shouldShow) {
        // Delay ad initialization to ensure container is fully rendered
        setTimeout(() => {
          try {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          } catch (e) {
            console.error('AdSense error:', e);
          }
        }, 100);
      }
    }
  }
}
