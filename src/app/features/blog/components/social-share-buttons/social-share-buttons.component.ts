import { Component, Input, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

/**
 * Social Share Buttons Component
 * Provides sharing functionality for social media platforms
 */
@Component({
  selector: 'app-social-share-buttons',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatSnackBarModule, MatTooltipModule],
  templateUrl: './social-share-buttons.component.html',
  styleUrls: ['./social-share-buttons.component.scss'],
})
export class SocialShareButtonsComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) url!: string;
  @Input() description?: string;
  @Input() layout: 'horizontal' | 'vertical' = 'horizontal';

  private snackBar = inject(MatSnackBar);
  private platformId = inject(PLATFORM_ID);

  shareOnTwitter(): void {
    const text = encodeURIComponent(this.title);
    const shareUrl = encodeURIComponent(this.url);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`,
      '_blank',
      'width=600,height=400'
    );
  }

  shareOnFacebook(): void {
    const shareUrl = encodeURIComponent(this.url);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      '_blank',
      'width=600,height=400'
    );
  }

  shareOnLinkedIn(): void {
    const shareUrl = encodeURIComponent(this.url);
    const title = encodeURIComponent(this.title);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      '_blank',
      'width=600,height=400'
    );
  }

  async copyLink(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(this.url);
        this.snackBar.open('Link copied to clipboard!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = this.url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        this.snackBar.open('Link copied to clipboard!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }
    } catch (error) {
      this.snackBar.open('Failed to copy link', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    }
  }
}
