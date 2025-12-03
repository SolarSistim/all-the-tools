import { Component, inject, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';
import { MetaService } from '../../core/services/meta.service';
import { CtaEmailList } from '../reusable-components/cta-email-list/cta-email-list';

@Component({
  selector: 'app-accessibility',
  standalone: true,
  imports: [PageHeaderComponent,CtaEmailList],
  templateUrl: './accessibility.html',
  styleUrl: './accessibility.scss',
})
export class AccessibilityComponent implements OnInit {
  private metaService = inject(MetaService);

  currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  ngOnInit(): void {
    this.metaService.updateTags({
      title: 'Accessibility Statement',
      description: 'Our commitment to making All The Tools accessible to everyone.',
      keywords: ['accessibility', 'wcag', 'all the tools'],
      image: 'https://www.allthethings.dev/meta-images/og-accessibility-statement.png',
      url: 'https://www.allthethings.dev/accessibility'
    });
  }
}
