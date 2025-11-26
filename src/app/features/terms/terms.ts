import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [PageHeaderComponent],
  templateUrl: './terms.html',
  styleUrl: './terms.scss',
})
export class TermsComponent {
  currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
