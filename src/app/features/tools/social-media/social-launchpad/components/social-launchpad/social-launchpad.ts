import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';

import { PlatformId, ContentData, OGData, PlatformStatus, PLATFORM_CONFIGS } from '../../models/platform.model';
import { LocalStorageService } from '../../services/local-storage.service';
import { PlatformFormatterService } from '../../services/platform-formatter.service';
import { ShareGeneratorService } from '../../services/share-generator.service';
import { OGFetcherService } from '../../services/og-fetcher.service';
import { MetaService } from '../../../../../../core/services/meta.service';

import { ContentEditorComponent } from '../content-editor/content-editor';
import { PlatformSelectorComponent } from '../platform-selector/platform-selector';
import { CharacterCounterComponent } from '../character-counter/character-counter';
import { EmojiSuggestionsComponent } from '../emoji-suggestions/emoji-suggestions';
import { PlatformPreviewComponent, PlatformPreviewData } from '../platform-preview/platform-preview';
import { DeviceWarningDialogComponent } from '../device-warning-dialog/device-warning-dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from '../confirm-dialog/confirm-dialog';
import { InputDialogComponent, InputDialogData } from '../input-dialog/input-dialog';
import { AdsenseComponent } from '../../../../../blog/components/adsense/adsense.component';

@Component({
  selector: 'app-social-launchpad',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    ContentEditorComponent,
    PlatformSelectorComponent,
    CharacterCounterComponent,
    AdsenseComponent
  ],
  templateUrl: './social-launchpad.html',
  styleUrl: './social-launchpad.scss'
})
export class SocialLaunchpadComponent implements OnInit, OnDestroy {
  private localStorageService = inject(LocalStorageService);
  private formatterService = inject(PlatformFormatterService);
  private shareService = inject(ShareGeneratorService);
  private ogFetcherService = inject(OGFetcherService);
  private metaService = inject(MetaService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  public readonly ogFetchLimitPerMin = environment.ogFetchLimitPerMin;

  private destroy$ = new Subject<void>();

  // State signals
  url = signal<string>('');
  description = signal<string>('');
  hashtags = signal<string[]>([]);
  selectedPlatforms = signal<PlatformId[]>([]);
  ogData = signal<OGData | null>(null);
  ogLoading = signal<boolean>(false);
  ogError = signal<string | null>(null);
  preferences = this.localStorageService.loadPreferences();
  cursorPosition = signal<number>(0);

  // Computed values
  platformStatuses = signal<PlatformStatus[]>([]);
  platformStatusMap = signal<Map<PlatformId, PlatformStatus>>(new Map());

  ngOnInit(): void {
    this.metaService.updateTags({
      title: 'Social Media Launchpad - Multi-Platform Post Composer',
      description: 'Craft optimized content for multiple social platforms simultaneously. Real-time character counts, hashtag recommendations, OG preview, and emoji picker for X (Twitter), Facebook, LinkedIn, Threads, and more.',
      keywords: ['social media tool', 'multi-platform posting', 'character counter', 'hashtag tool', 'twitter character count', 'facebook post', 'linkedin post', 'social media composer'],
      image: 'https://ik.imagekit.io/allthethingsdev/Social%20Media%20Launchpad/og-social-media-post-composer.jpg',
      url: 'https://www.allthethings.dev/tools/social-media-launchpad',
      jsonLd: this.metaService.buildToolJsonLd({
        name: 'Social Media Launchpad - Multi-Platform Post Composer',
        description: 'Craft optimized content for multiple social platforms simultaneously. Real-time character counts, hashtag recommendations, OG preview, and emoji picker for X (Twitter), Facebook, LinkedIn, Threads, and more.',
        url: 'https://www.allthethings.dev/tools/social-media-launchpad',
        image: 'https://ik.imagekit.io/allthethingsdev/Social%20Media%20Launchpad/og-social-media-post-composer.jpg'
      })
    });

    this.loadContentFromStorage();
    this.checkDeviceAndShowWarning();
  }

  private checkDeviceAndShowWarning(): void {
    // Only check if we are in the browser
    if (typeof window !== 'undefined') {
      const isMobileOrTablet = window.innerWidth < 1024 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const hasSeenWarning = localStorage.getItem('social-launchpad-device-warning-seen') === 'true';

      if (isMobileOrTablet && !hasSeenWarning) {
        this.dialog.open(DeviceWarningDialogComponent, {
          width: '500px',
          disableClose: false
        }).afterClosed().subscribe(() => {
          localStorage.setItem('social-launchpad-device-warning-seen', 'true');
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadContentFromStorage(): void {
    const saved = this.localStorageService.loadCurrentContent();
    if (saved) {
      this.url.set(saved.url);
      this.description.set(saved.description);
      this.hashtags.set(saved.hashtags);
      this.selectedPlatforms.set(saved.selectedPlatforms);
      this.ogData.set(saved.ogData);
    } else {
      // Load default platforms from preferences
      this.selectedPlatforms.set(this.preferences.defaultPlatforms);
    }
    this.updatePlatformStatuses();
  }

  private saveContentToStorage(): void {
    const content: ContentData = {
      url: this.url(),
      description: this.description(),
      hashtags: this.hashtags(),
      ogData: this.ogData(),
      selectedPlatforms: this.selectedPlatforms(),
      lastModified: new Date().toISOString()
    };
    this.localStorageService.saveCurrentContent(content);
  }

  // Content Editor handlers
  onUrlChange(url: string): void {
    this.url.set(url);
    this.saveContentToStorage();
  }

  onDescriptionChange(description: string): void {
    this.description.set(description);
    this.updatePlatformStatuses();
    this.saveContentToStorage();
  }

  onHashtagsChange(hashtags: string[]): void {
    this.hashtags.set(hashtags);
    this.updatePlatformStatuses();
    this.saveContentToStorage();
  }

  onFetchOG(): void {
    if (!this.url()) return;

    this.ogLoading.set(true);
    this.ogError.set(null);

    this.ogFetcherService.fetchOGData(this.url())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.ogLoading.set(false);
          if (response.success && response.data) {
            this.ogData.set(response.data);
            this.saveContentToStorage();
            this.snackBar.open('OG data fetched successfully!', 'Close', { duration: 3000 });
          } else {
            if (response.queuePosition) {
              this.ogError.set(`Only 10 fetches are allowed per minute. You are ${response.queuePosition} in line. Please try again shortly.`);
            } else {
              this.ogError.set(response.error || 'Failed to fetch OG data');
            }
          }
        },
        error: (error) => {
          this.ogLoading.set(false);
          this.ogError.set('An error occurred while fetching OG data');
          console.error('OG fetch error:', error);
        }
      });
  }

  onRetryOG(): void {
    this.onFetchOG();
  }

  // Platform Selector handlers
  onPlatformToggle(platformId: PlatformId): void {
    const current = this.selectedPlatforms();
    const index = current.indexOf(platformId);

    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(platformId);
    }

    this.selectedPlatforms.set([...current]);
    this.updatePlatformStatuses();
    this.saveContentToStorage();
  }

  onPlatformClick(platformId: PlatformId): void {
    this.openPlatformPreview(platformId);
  }

  private openPlatformPreview(platformId: PlatformId): void {
    const formattedText = this.formatterService.formatForPlatform(
      this.description(),
      this.hashtags(),
      this.url(),
      platformId
    );

    const status = this.formatterService.getPlatformStatus(
      this.description(),
      this.hashtags(),
      this.url(),
      platformId
    );

    const shareUrl = this.shareService.generateShareUrl(platformId, formattedText, this.url());

    const data: PlatformPreviewData = {
      platformId,
      formattedText,
      characterCount: status.characterCount,
      shareUrl
    };

    this.dialog.open(PlatformPreviewComponent, {
      width: '600px',
      data
    });
  }

  // Emoji handler
  onEmojiSelect(emoji: string): void {
    // Insert emoji at cursor position
    const currentDesc = this.description();
    const pos = this.cursorPosition();
    const newDesc = currentDesc.slice(0, pos) + emoji + currentDesc.slice(pos);
    this.description.set(newDesc);
    this.cursorPosition.set(pos + emoji.length);
    this.updatePlatformStatuses();
    this.saveContentToStorage();
  }

  onCursorPositionChange(position: number): void {
    this.cursorPosition.set(position);
  }

  // Copy all content
  async onCopyContent(): Promise<void> {
    if (!this.description() && !this.hashtags().length && !this.url()) {
      this.snackBar.open('Nothing to copy. Add content first.', 'Close', { duration: 3000 });
      return;
    }

    let formattedContent = '';

    // Add description
    if (this.description()) {
      formattedContent += this.description();
    }

    // Add hashtags
    if (this.hashtags().length > 0) {
      if (formattedContent) {
        formattedContent += '\n\n';
      }
      formattedContent += this.hashtags().join(' ');
    }

    // Add URL
    if (this.url()) {
      if (formattedContent) {
        formattedContent += '\n\n';
      }
      formattedContent += this.url();
    }

    try {
      await navigator.clipboard.writeText(formattedContent);
      this.snackBar.open('All content copied to clipboard!', 'Close', { duration: 3000 });
    } catch (error) {
      this.snackBar.open('Failed to copy to clipboard', 'Close', { duration: 3000 });
    }
  }

  // Copy description only
  async onCopyDescription(): Promise<void> {
    if (!this.description()) {
      this.snackBar.open('No description to copy. Add content first.', 'Close', { duration: 3000 });
      return;
    }

    try {
      await navigator.clipboard.writeText(this.description());
      this.snackBar.open('Description copied to clipboard!', 'Close', { duration: 3000 });
    } catch (error) {
      this.snackBar.open('Failed to copy to clipboard', 'Close', { duration: 3000 });
    }
  }

  // Copy hashtags only
  async onCopyHashtags(): Promise<void> {
    if (this.hashtags().length === 0) {
      this.snackBar.open('No hashtags to copy. Add hashtags first.', 'Close', { duration: 3000 });
      return;
    }

    const formattedHashtags = this.hashtags().join(' ');

    try {
      await navigator.clipboard.writeText(formattedHashtags);
      this.snackBar.open('Hashtags copied to clipboard!', 'Close', { duration: 3000 });
    } catch (error) {
      this.snackBar.open('Failed to copy to clipboard', 'Close', { duration: 3000 });
    }
  }

  // Clear/Reset handler
  onClearAll(): void {
    const dialogData: ConfirmDialogData = {
      title: 'Clear All Content',
      message: 'Are you sure you want to clear all content? This will reset everything except saved variations.',
      confirmText: 'Clear All',
      cancelText: 'Cancel',
      icon: 'warning'
    };

    this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: dialogData
    }).afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.url.set('');
      this.description.set('');
      this.hashtags.set([]);
      this.ogData.set(null);
      this.ogError.set(null);
      this.selectedPlatforms.set(this.preferences.defaultPlatforms);
      this.cursorPosition.set(0);

      this.localStorageService.clearCurrentContent();
      this.updatePlatformStatuses();
      this.snackBar.open('All content cleared!', 'Close', { duration: 3000 });
    });
  }

  // Update platform statuses
  private updatePlatformStatuses(): void {
    const statuses = this.formatterService.getAllPlatformStatuses(
      this.description(),
      this.hashtags(),
      this.url(),
      this.selectedPlatforms()
    );

    this.platformStatuses.set(statuses);

    const statusMap = new Map<PlatformId, PlatformStatus>();
    statuses.forEach(status => {
      statusMap.set(status.platform, status);
    });
    this.platformStatusMap.set(statusMap);
  }
}
