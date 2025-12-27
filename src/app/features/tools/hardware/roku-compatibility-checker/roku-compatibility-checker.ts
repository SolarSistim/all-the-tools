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
    AlertWarning
  ],
  templateUrl: './roku-compatibility-checker.html',
  styleUrl: './roku-compatibility-checker.scss',
})
export class RokuCompatibilityChecker implements OnInit {
  private metaService = inject(MetaService);

  ngOnInit(): void {
    this.metaService.updateTags({
      title: 'Roku Compatibility Checker',
      description: 'Check compatibility for Roku devices including 4K, HDR, Dolby Vision, voice remotes, smart home integration, and more.',
      keywords: ['roku compatibility', 'roku checker', 'roku features', 'roku 4k', 'roku voice remote', 'roku airplay'],
      image: 'https://www.allthethings.dev/meta-images/og-roku-compatibility-checker.png',
      url: 'https://www.allthethings.dev/tools/roku-compatibility-checker'
    });
  }

  scrollToChecker(): void {
    const element = document.querySelector('app-roku-programmatic-compatibility-checker');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
