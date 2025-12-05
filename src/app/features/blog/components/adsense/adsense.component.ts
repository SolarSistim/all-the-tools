import { Component, Input } from '@angular/core';
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
export class AdsenseComponent {
  @Input() adClient: string = 'ca-pub-7077792325295668';
  @Input() adSlot: string = '3887470191';
  @Input() width: string = '100vw';
  @Input() height: string = '320';
  @Input() autoFormat: string = 'rspv';
  @Input() fullWidth: boolean = true;
}
