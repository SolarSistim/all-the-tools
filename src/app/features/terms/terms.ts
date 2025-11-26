import { Component, inject, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';
import { MetaService } from '../../core/services/meta.service';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [PageHeaderComponent],
  templateUrl: './terms.html',
  styleUrl: './terms.scss',
})
export class TermsComponent implements OnInit {
  private metaService = inject(MetaService);

  currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  ngOnInit(): void {
    this.metaService.updateTags({
      title: 'Terms of Service - All The Tools',
      description: 'Terms and conditions for using All The Tools.',
      keywords: ['terms of service', 'terms and conditions', 'all the tools'],
      url: 'https://all-the-tools.netlify.app/terms'
    });
  }
}
