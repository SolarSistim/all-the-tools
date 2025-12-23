import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-back-to-top',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './back-to-top.html',
  styleUrl: './back-to-top.scss'
})
export class BackToTopComponent {
  scrollToTop() {
    // Scroll the mat-sidenav-content element (which is the actual scroll container)
    const sidenavContent = document.querySelector('mat-sidenav-content');
    if (sidenavContent) {
      sidenavContent.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Also scroll window as fallback
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
