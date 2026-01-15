import { Component, Input, AfterViewInit, ElementRef, Inject, PLATFORM_ID, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

/**
 * AdSense Component
 * Displays Google AdSense ads within article content
 * Shows a placeholder in development mode
 */
@Component({
  selector: 'app-adsense',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './adsense.component.html',
  styleUrls: ['./adsense.component.scss'],
})
export class AdsenseComponent implements AfterViewInit {
  @Input() adClient: string = 'ca-pub-7077792325295668';
  @Input() adSlot: string = '3887470191';
  @Input() adFormat: string = 'auto';
  @Input() fullWidthResponsive: string = 'true';

  // Check if we're in development mode
  isDevelopment = isDevMode();
  isEnabled = environment.adsEnabled;

  constructor(
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngAfterViewInit(): void {
    if (!this.isEnabled) {
      const element = this.elementRef.nativeElement;
      const parent = element?.parentNode;
      if (parent) {
        parent.removeChild(element);
      }
      return;
    }

    // Only initialize ads in production mode
    if (!this.isDevelopment && isPlatformBrowser(this.platformId)) {
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
