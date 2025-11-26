import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';

@Component({
  selector: 'app-accessibility',
  standalone: true,
  imports: [PageHeaderComponent],
  templateUrl: './accessibility.html',
  styleUrl: './accessibility.scss',
})
export class AccessibilityComponent {
  currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
