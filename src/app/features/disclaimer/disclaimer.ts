import { Component, inject, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';
import { MetaService } from '../../core/services/meta.service';
import { CtaEmailList } from '../reusable-components/cta-email-list/cta-email-list';

@Component({
  selector: 'app-disclaimer',
  standalone: true,
  imports: [PageHeaderComponent, CtaEmailList],
  templateUrl: './disclaimer.html',
  styleUrl: './disclaimer.scss',
})
export class Disclaimer implements OnInit {
  private metaService = inject(MetaService);

  currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  ngOnInit(): void {
    this.metaService.updateTags({
      title: 'Disclaimer',
      description: 'Important disclaimer and limitations for using All The Tools.',
      keywords: ['disclaimer', 'legal notice', 'all the tools'],
      image: 'https://www.allthethings.dev/meta-images/og-disclaimer.png',
      url: 'https://www.allthethings.dev/disclaimer'
    });
  }
}
