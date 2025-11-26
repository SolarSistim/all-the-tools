import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';
import { MetaService } from '../../core/services/meta.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [MatIconModule, PageHeaderComponent],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class AboutComponent implements OnInit {
  private metaService = inject(MetaService);

  ngOnInit(): void {
    this.metaService.updateTags({
      title: 'About - All The Tools',
      description: 'Learn about All The Tools - your comprehensive collection of free online utilities for everyday tasks.',
      keywords: ['about', 'all the tools', 'free online tools'],
      url: 'https://all-the-tools.netlify.app/about'
    });
  }
}
