import { Component, inject, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';
import { MetaService } from '../../core/services/meta.service';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [PageHeaderComponent],
  templateUrl: './privacy.html',
  styleUrl: './privacy.scss',
})
export class PrivacyComponent implements OnInit {
  private metaService = inject(MetaService);

  currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  ngOnInit(): void {
    this.metaService.updateTags({
      title: 'Privacy Policy',
      description: 'Our commitment to your privacy and how we handle your data.',
      keywords: ['privacy policy', 'data privacy', 'all the tools'],
      image: 'https://www.allthethings.dev/meta-images/og-privacy-policy.png',
      url: 'https://www.allthethings.dev/privacy'
    });
  }
}
