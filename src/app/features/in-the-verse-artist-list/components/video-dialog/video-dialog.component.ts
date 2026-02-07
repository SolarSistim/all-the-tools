import { Component, Inject, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ArtistVideo } from '../../models/artist.models';

// YouTube IFrame API types
interface YTPlayerOptions {
  videoId: string;
  width?: string | number;
  height?: string | number;
  playerVars?: {
    autoplay?: number;
    modestbranding?: number;
    rel?: number;
  };
  events?: {
    onStateChange?: (event: YTStateChangeEvent) => void;
    onReady?: (event: { target: YTPlayer }) => void;
  };
}

interface YTStateChangeEvent {
  data: number;
  target: YTPlayer;
}

interface YTPlayer {
  loadVideoById(videoId: string): void;
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  destroy(): void;
}

interface YTNamespace {
  Player: new (element: HTMLElement, options: YTPlayerOptions) => YTPlayer;
}

declare global {
  interface Window {
    YT: YTNamespace;
    onYouTubeIframeAPIReady: () => void;
  }
}

export interface VideoDialogData {
  videos: ArtistVideo[];
  artistName: string;
  startIndex?: number;
}

const STORAGE_KEY = 'video-gallery-loop-preference';

@Component({
  selector: 'app-video-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <div class="video-dialog-container">
      <div class="dialog-header">
        <div class="header-info">
          <h2 class="dialog-title">{{ data.artistName }}</h2>
        </div>
        <div class="header-actions">
          @if (data.videos.length > 1) {
            <button
              mat-icon-button
              class="loop-toggle"
              [class.active]="loopEnabled"
              (click)="toggleLoop()"
              [matTooltip]="loopEnabled ? 'Loop current video' : 'Auto-play next video'"
              matTooltipPosition="below"
              aria-label="Toggle loop mode"
            >
              <mat-icon>{{ loopEnabled ? 'repeat_one' : 'skip_next' }}</mat-icon>
            </button>
            <span class="video-counter">{{ currentIndex + 1 }} / {{ data.videos.length }}</span>
          }
          <button mat-icon-button (click)="onClose()" class="close-button" aria-label="Close">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>

      <div class="video-content">
        @if (data.videos.length > 1) {
          <button
            mat-icon-button
            class="nav-button nav-prev"
            (click)="previousVideo()"
            aria-label="Previous video"
          >
            <mat-icon>chevron_left</mat-icon>
          </button>
        }

        <div class="video-wrapper">
          <div #playerContainer id="youtube-player"></div>
        </div>

        @if (data.videos.length > 1) {
          <button
            mat-icon-button
            class="nav-button nav-next"
            (click)="nextVideo()"
            aria-label="Next video"
          >
            <mat-icon>chevron_right</mat-icon>
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    ::ng-deep .video-dialog-panel {
      max-width: 90vw !important;
      max-height: 90vh !important;
    }

    ::ng-deep .video-dialog-panel .mat-mdc-dialog-container {
      border: none !important;
      border-radius: 12px !important;
      padding: 0 !important;
      overflow: hidden;
    }

    ::ng-deep .video-dialog-panel .mat-mdc-dialog-surface {
      border-radius: 12px !important;
      background: transparent !important;
    }

    .video-dialog-container {
      background: var(--bg-elevated, #1a1a1a);
      border-radius: 12px;
      overflow: hidden;
      width: 80vw;
      max-width: 1000px;

      @media (max-width: 768px) {
        width: 95vw;
      }
    }

    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      background: linear-gradient(135deg, rgba(0, 188, 212, 0.1) 0%, rgba(156, 39, 176, 0.1) 100%);
      border-bottom: 1px solid var(--border-color, #333);
      gap: 1rem;
    }

    .header-info {
      flex: 1;
      min-width: 0;
    }

    .dialog-title {
      margin: 0;
      font-family: 'Orbitron', 'Space Grotesk', sans-serif;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary, #ffffff);

      @media (max-width: 768px) {
        font-size: 1rem;
      }
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .loop-toggle {
      color: var(--text-secondary, #b0b0b0);
      transition: all 0.2s ease;

      &:hover {
        color: var(--text-primary, #ffffff);
        background: rgba(255, 255, 255, 0.1);
      }

      &.active {
        color: var(--neon-cyan, #00bcd4);

        &:hover {
          background: rgba(0, 188, 212, 0.2);
        }
      }
    }

    .video-counter {
      font-size: 0.875rem;
      color: var(--neon-cyan, #00bcd4);
      font-weight: 600;
      font-family: 'Space Grotesk', sans-serif;
    }

    .close-button {
      color: var(--text-secondary, #b0b0b0);
      transition: all 0.2s ease;

      &:hover {
        color: var(--text-primary, #ffffff);
        background: rgba(255, 255, 255, 0.1);
      }
    }

    .video-content {
      position: relative;
      display: flex;
      align-items: center;
    }

    .nav-button {
      position: absolute;
      z-index: 10;
      background: rgba(0, 0, 0, 0.7) !important;
      color: white !important;
      width: 48px;
      height: 48px;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(0, 188, 212, 0.8) !important;
        transform: scale(1.1);
      }

      mat-icon {
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
      }

      @media (max-width: 768px) {
        width: 36px;
        height: 36px;

        mat-icon {
          font-size: 1.5rem;
          width: 1.5rem;
          height: 1.5rem;
        }
      }
    }

    .nav-prev {
      left: 1rem;

      @media (max-width: 768px) {
        left: 0.5rem;
      }
    }

    .nav-next {
      right: 1rem;

      @media (max-width: 768px) {
        right: 0.5rem;
      }
    }

    .video-wrapper {
      position: relative;
      width: 100%;
      padding-bottom: 56.25%; /* 16:9 aspect ratio */
      background: #000;

      #youtube-player {
        position: absolute;
        top: 0;
        left: 0;
        width: 100% !important;
        height: 100% !important;
      }
    }

    ::ng-deep .video-wrapper iframe {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
    }
  `]
})
export class VideoDialogComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('playerContainer') playerContainer!: ElementRef;

  currentIndex: number;
  loopEnabled: boolean = false;
  private player: YTPlayer | null = null;
  private apiReady = false;

  constructor(
    public dialogRef: MatDialogRef<VideoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VideoDialogData,
    private ngZone: NgZone
  ) {
    this.currentIndex = data.startIndex ?? 0;
    this.loadLoopPreference();
  }

  ngOnInit(): void {
    this.loadYouTubeAPI();
  }

  ngAfterViewInit(): void {
    if (this.apiReady) {
      this.createPlayer();
    }
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.destroy();
    }
  }

  get currentVideo(): ArtistVideo {
    return this.data.videos[this.currentIndex];
  }

  private loadLoopPreference(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        this.loopEnabled = stored === 'true';
      } else {
        // Default to auto-advance (loop disabled)
        this.loopEnabled = false;
      }
    } catch {
      this.loopEnabled = false;
    }
  }

  private saveLoopPreference(): void {
    try {
      localStorage.setItem(STORAGE_KEY, String(this.loopEnabled));
    } catch {
      // localStorage not available
    }
  }

  toggleLoop(): void {
    this.loopEnabled = !this.loopEnabled;
    this.saveLoopPreference();
  }

  private loadYouTubeAPI(): void {
    if (window.YT && window.YT.Player) {
      this.apiReady = true;
      if (this.playerContainer) {
        this.createPlayer();
      }
      return;
    }

    // Store reference to component for callback
    const self = this;

    // Set up the callback before loading the script
    window.onYouTubeIframeAPIReady = () => {
      self.ngZone.run(() => {
        self.apiReady = true;
        if (self.playerContainer) {
          self.createPlayer();
        }
      });
    };

    // Load the API if not already loading
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(script);
    }
  }

  private createPlayer(): void {
    if (!this.playerContainer?.nativeElement || !window.YT?.Player) {
      return;
    }

    // Clear existing player
    if (this.player) {
      this.player.destroy();
    }

    this.player = new window.YT.Player(this.playerContainer.nativeElement, {
      videoId: this.currentVideo.id,
      width: '100%',
      height: '100%',
      playerVars: {
        autoplay: 1,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onStateChange: (event: YTStateChangeEvent) => {
          this.ngZone.run(() => {
            this.onPlayerStateChange(event);
          });
        },
      },
    });
  }

  private onPlayerStateChange(event: YTStateChangeEvent): void {
    // YT.PlayerState.ENDED === 0
    if (event.data === 0) {
      if (this.loopEnabled) {
        // Replay current video
        this.player?.seekTo(0, true);
        this.player?.playVideo();
      } else if (this.data.videos.length > 1) {
        // Go to next video
        this.nextVideo();
      } else {
        // Single video, replay it
        this.player?.seekTo(0, true);
        this.player?.playVideo();
      }
    }
  }

  previousVideo(): void {
    this.currentIndex = this.currentIndex === 0
      ? this.data.videos.length - 1
      : this.currentIndex - 1;
    this.loadVideo();
  }

  nextVideo(): void {
    this.currentIndex = this.currentIndex === this.data.videos.length - 1
      ? 0
      : this.currentIndex + 1;
    this.loadVideo();
  }

  private loadVideo(): void {
    if (this.player) {
      this.player.loadVideoById(this.currentVideo.id);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
