import { Component, Input, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * AdSense Component
 * Displays Google AdSense ads within article content
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

  ngAfterViewInit(): void {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }
}
