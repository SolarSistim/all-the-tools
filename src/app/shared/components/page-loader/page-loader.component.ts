import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PageLoaderService } from '../../../core/services/page-loader.service';

@Component({
  selector: 'app-page-loader',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './page-loader.component.html',
  styleUrl: './page-loader.component.scss'
})
export class PageLoaderComponent {
  private loaderService = inject(PageLoaderService);
  private platformId = inject(PLATFORM_ID);

  /**
   * Get loading state
   */
  get isLoading(): boolean {
    // Only show loader in browser (not during SSR)
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    return this.loaderService.isLoading();
  }
}
