import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MetaService } from '../../../../core/services/meta.service';
import { CtaEmailList } from '../../../reusable-components/cta-email-list/cta-email-list';
import { AdsenseComponent } from '../../../blog/components/adsense/adsense.component';
import { RokuProgrammaticCompatibilityChecker } from './roku-programmatic-compatibility-checker/roku-programmatic-compatibility-checker';
import { AlertWarning } from '../../../reusable-components/alerts/alert-warning/alert-warning';
import { RelatedBlogPosts } from '../../../reusable-components/related-blog-posts/related-blog-posts';

@Component({
  selector: 'app-roku-compatibility-checker',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    CtaEmailList,
    AdsenseComponent,
    RokuProgrammaticCompatibilityChecker,
    AlertWarning,
    RelatedBlogPosts
  ],
  templateUrl: './roku-compatibility-checker.html',
  styleUrl: './roku-compatibility-checker.scss',
})
export class RokuCompatibilityChecker implements OnInit {
  private metaService = inject(MetaService);

  relatedBlogPosts = [
    {
      title: 'I Built a Roku Compatibility Checker (And Why You Might Need It)',
      slug: 'i-built-a-roku-compatibility-checker'
    },
    {
      title: 'Roku TV Black Screen of Death: Class Action Investigation',
      slug: 'roku-tv-black-screen-defect-class-action-lawsuit'
    }
  ];

  ngOnInit(): void {
    this.metaService.updateTags({
      title: 'Roku Compatibility Checker',
      description: 'Check compatibility for Roku devices including 4K, HDR, Dolby Vision, voice remotes, smart home integration, and more.',
      keywords: ['roku compatibility', 'roku checker', 'roku features', 'roku 4k', 'roku voice remote', 'roku airplay'],
      image: 'https://www.allthethings.dev/meta-images/og-roku-compatibility-checker.png',
      url: 'https://www.allthethings.dev/tools/roku-compatibility',
      jsonLd: this.metaService.buildToolJsonLd({
        name: 'Roku Compatibility Checker',
        description: 'Check compatibility for Roku devices including 4K, HDR, Dolby Vision, voice remotes, smart home integration, and more.',
        url: 'https://www.allthethings.dev/tools/roku-compatibility',
        image: 'https://www.allthethings.dev/meta-images/og-roku-compatibility-checker.png'
      })
    });
  }

  scrollToChecker(): void {
    const element = document.querySelector('app-roku-programmatic-compatibility-checker');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
