import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AffiliateProduct } from '../../models/blog.models';

/**
 * Affiliate Link Component
 * Displays affiliate product cards with proper disclosure
 */
@Component({
  selector: 'app-affiliate-link',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './affiliate-link.component.html',
  styleUrls: ['./affiliate-link.component.scss'],
})
export class AffiliateLinkComponent {
  @Input({ required: true }) product!: AffiliateProduct;
  @Input() variant: 'card' | 'compact' = 'card';

  get defaultDisclosure(): string {
    return 'As an Amazon Associate, we earn from qualifying purchases. This means we may receive a commission if you click through and make a purchase.';
  }
}
