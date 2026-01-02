import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

/**
 * Video Embed Component
 * Displays embedded videos from YouTube or Vimeo
 */
@Component({
  selector: 'app-video-embed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-embed.component.html',
  styleUrl: './video-embed.component.scss',
})
export class VideoEmbedComponent implements OnInit {
  @Input() url: string = '';
  @Input() title?: string;
  @Input() description?: string;
  @Input() platform?: 'youtube' | 'vimeo';

  embedUrl: SafeResourceUrl | null = null;
  detectedPlatform: 'youtube' | 'vimeo' | 'unknown' = 'unknown';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.embedUrl = this.getEmbedUrl();
  }

  /**
   * Convert regular video URL to embed URL
   */
  private getEmbedUrl(): SafeResourceUrl | null {
    if (!this.url) return null;

    let embedUrl = '';

    // Detect platform if not specified
    if (!this.platform) {
      if (this.url.includes('youtube.com') || this.url.includes('youtu.be')) {
        this.detectedPlatform = 'youtube';
      } else if (this.url.includes('vimeo.com')) {
        this.detectedPlatform = 'vimeo';
      }
    } else {
      this.detectedPlatform = this.platform;
    }

    // Convert to embed URL
    if (this.detectedPlatform === 'youtube') {
      embedUrl = this.getYouTubeEmbedUrl(this.url);
    } else if (this.detectedPlatform === 'vimeo') {
      embedUrl = this.getVimeoEmbedUrl(this.url);
    }

    return embedUrl ? this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl) : null;
  }

  /**
   * Convert YouTube URL to embed format
   */
  private getYouTubeEmbedUrl(url: string): string {
    // Extract video ID from various YouTube URL formats
    let videoId = '';

    // Standard watch URL: https://www.youtube.com/watch?v=VIDEO_ID
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    if (watchMatch) {
      videoId = watchMatch[1];
    }

    // Short URL: https://youtu.be/VIDEO_ID
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch) {
      videoId = shortMatch[1];
    }

    // Extract timestamp if present (t=37s or start=37)
    let timestamp = '';
    const timeMatch = url.match(/[?&]t=(\d+)s?/) || url.match(/[?&]start=(\d+)/);
    if (timeMatch) {
      timestamp = `?start=${timeMatch[1]}`;
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}${timestamp}` : '';
  }

  /**
   * Convert Vimeo URL to embed format
   */
  private getVimeoEmbedUrl(url: string): string {
    // Extract video ID from Vimeo URL
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? `https://player.vimeo.com/video/${match[1]}` : '';
  }
}
