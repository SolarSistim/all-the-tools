import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';
import { MetaService } from '../../core/services/meta.service';
import { CtaEmailList } from '../reusable-components/cta-email-list/cta-email-list';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatButtonModule, PageHeaderComponent,CtaEmailList],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class AboutComponent implements OnInit {
  private metaService = inject(MetaService);

  ngOnInit(): void {
    this.metaService.updateTags({
      title: 'About All The Tools',
      description: 'Learn about All The Tools - your comprehensive collection of free online utilities for everyday tasks.',
      keywords: ['about', 'all the tools', 'free online tools'],
      image: 'https://www.allthethings.dev/meta-images/og-about.png',
      url: 'https://www.allthethings.dev/about'
    });
  }
}
