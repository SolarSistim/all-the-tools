import { Component, inject, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';
import { MetaService } from '../../core/services/meta.service';

@Component({
  selector: 'app-accessibility',
  standalone: true,
  imports: [PageHeaderComponent],
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
      title: 'Accessibility Statement - All The Tools',
      description: 'Our commitment to making All The Tools accessible to everyone.',
      keywords: ['accessibility', 'wcag', 'all the tools'],
      url: 'https://all-the-tools.netlify.app/accessibility'
    });
  }
}
