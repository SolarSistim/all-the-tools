import { Component, Input, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VisitLoggerService } from '../../../../core/services/visit-logger.service';

/**
 * YouTube Player Component
 * Displays a YouTube video with options to watch embedded or open in YouTube
 */
@Component({
  selector: 'app-youtube-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './youtube-player.component.html',
  styleUrl: './youtube-player.component.scss',
})
export class YoutubePlayerComponent implements OnInit {
  @Input() videoId: string = '';
  @Input() title?: string;
  @Input() description?: string;

  @ViewChild('youtubeIframe') youtubeIframe?: ElementRef<HTMLIFrameElement>;

  private visitLogger = inject(VisitLoggerService);
  private location = inject(Location);
  private sanitizer = inject(DomSanitizer);

  isExpanded = false;
  error = false;
  embedUrl: SafeResourceUrl | null = null;
  youtubeUrl: string = '';

  ngOnInit(): void {
    // Validate videoId input
    if (!this.videoId) {
      this.error = true;
      return;
    }

    // Extract video ID if full URL was provided
    this.videoId = this.extractVideoId(this.videoId);

    // Generate URLs
    this.youtubeUrl = `https://www.youtube.com/watch?v=${this.videoId}`;
    // Enable YouTube iframe API for player control
    this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${this.videoId}?autoplay=1&rel=0&enablejsapi=1`
    );
  }

  private extractVideoId(input: string): string {
    // If it's already just the video ID, return it
    if (input.length === 11 && !input.includes('/') && !input.includes('?')) {
      return input;
    }

    // Try to extract from various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    // If no pattern matched, return the input as-is
    return input;
  }

  expandPlayer(): void {
    this.isExpanded = true;
    // Log expand-play event (video auto-plays when expanded)
    this.visitLogger.logVideoEvent('expand-play', this.location.path(), this.videoId);
  }

  collapsePlayer(): void {
    this.isExpanded = false;
    // Log closed-player event (closing player stops video)
    this.visitLogger.logVideoEvent('closed-player', this.location.path(), this.videoId);
  }

  openInYouTube(): void {
    // Pause the video before opening in YouTube
    this.pauseVideo();

    // Log opened-in-youtube event
    this.visitLogger.logVideoEvent('opened-in-youtube', this.location.path(), this.videoId);
    window.open(this.youtubeUrl, '_blank', 'noopener,noreferrer');
  }

  private pauseVideo(): void {
    // Use YouTube iframe API to pause the video
    if (this.youtubeIframe?.nativeElement?.contentWindow) {
      this.youtubeIframe.nativeElement.contentWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        '*'
      );
    }
  }
}
