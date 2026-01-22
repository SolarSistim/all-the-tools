import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';

import { PlatformId, ContentData, OGData, ContentVariation, PlatformStatus, PLATFORM_CONFIGS } from '../../models/platform.model';
import { LocalStorageService } from '../../services/local-storage.service';
import { PlatformFormatterService } from '../../services/platform-formatter.service';
import { ShareGeneratorService } from '../../services/share-generator.service';
import { ContentVariationService } from '../../services/content-variation.service';
import { OGFetcherService } from '../../services/og-fetcher.service';

import { ContentEditorComponent } from '../content-editor/content-editor';
import { PlatformSelectorComponent } from '../platform-selector/platform-selector';
import { CharacterCounterComponent } from '../character-counter/character-counter';
import { EmojiSuggestionsComponent } from '../emoji-suggestions/emoji-suggestions';
import { ContentVariationsComponent } from '../content-variations/content-variations';
import { PlatformPreviewComponent, PlatformPreviewData } from '../platform-preview/platform-preview';

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
    EmojiSuggestionsComponent,
    ContentVariationsComponent
  ],
  templateUrl: './social-launchpad.html',
  styleUrl: './social-launchpad.scss'
})
export class SocialLaunchpadComponent implements OnInit, OnDestroy {
  private localStorageService = inject(LocalStorageService);
  private formatterService = inject(PlatformFormatterService);
  private shareService = inject(ShareGeneratorService);
  private variationService = inject(ContentVariationService);
  private ogFetcherService = inject(OGFetcherService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  private destroy$ = new Subject<void>();

  // State signals
  url = signal<string>('');
  description = signal<string>('');
  hashtags = signal<string[]>([]);
  selectedPlatforms = signal<PlatformId[]>([]);
  ogData = signal<OGData | null>(null);
  ogLoading = signal<boolean>(false);
  ogError = signal<string | null>(null);
  variations = signal<ContentVariation[]>([]);
  preferences = this.localStorageService.loadPreferences();
  cursorPosition = signal<number>(0);

  // Computed values
  platformStatuses = signal<PlatformStatus[]>([]);
  platformStatusMap = signal<Map<PlatformId, PlatformStatus>>(new Map());

  ngOnInit(): void {
    this.loadContentFromStorage();
    this.loadVariations();
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

  private loadVariations(): void {
    this.variations.set(this.variationService.getAllVariations());
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
            this.ogError.set(response.error || 'Failed to fetch OG data');
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

  // Variation handlers
  onCreateVariation(): void {
    const name = prompt('Enter variation name:', `Variation ${this.variations().length + 1}`);
    if (!name) return;

    const variation = this.variationService.createVariation(
      name,
      this.description(),
      [...this.hashtags()]
    );

    if (variation) {
      this.loadVariations();
      this.snackBar.open('Variation created!', 'Close', { duration: 3000 });
    } else {
      this.snackBar.open('Maximum 5 variations reached', 'Close', { duration: 3000 });
    }
  }

  onLoadVariation(variation: ContentVariation): void {
    this.description.set(variation.description);
    this.hashtags.set([...variation.hashtags]);
    this.updatePlatformStatuses();
    this.saveContentToStorage();
    this.snackBar.open('Variation loaded!', 'Close', { duration: 3000 });
  }

  onDeleteVariation(id: string): void {
    this.variationService.deleteVariation(id);
    this.loadVariations();
    this.snackBar.open('Variation deleted!', 'Close', { duration: 3000 });
  }

  // Copy formatted content
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
      this.snackBar.open('Content copied to clipboard!', 'Close', { duration: 3000 });
    } catch (error) {
      this.snackBar.open('Failed to copy to clipboard', 'Close', { duration: 3000 });
    }
  }

  // Clear/Reset handler
  onClearAll(): void {
    const confirmed = confirm('Are you sure you want to clear all content? This will reset everything except saved variations.');
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
  }

  // Action handlers
  async onOpenAllPlatforms(): Promise<void> {
    if (this.selectedPlatforms().length === 0) {
      this.snackBar.open('Please select at least one platform', 'Close', { duration: 3000 });
      return;
    }

    const formattedTexts = new Map<PlatformId, string>();
    const platformNames = new Map<PlatformId, string>();

    this.selectedPlatforms().forEach(platformId => {
      const formatted = this.formatterService.formatForPlatform(
        this.description(),
        this.hashtags(),
        this.url(),
        platformId
      );
      formattedTexts.set(platformId, formatted);
      platformNames.set(platformId, PLATFORM_CONFIGS[platformId].name);
    });

    const shareUrls = this.shareService.generateAllShareUrls(
      this.selectedPlatforms(),
      formattedTexts,
      this.url()
    );

    this.shareService.openAllShareWindows(shareUrls, platformNames);
    this.snackBar.open(`Opening ${this.selectedPlatforms().length} platforms...`, 'Close', { duration: 3000 });
  }

  async onCopyAll(): Promise<void> {
    if (this.selectedPlatforms().length === 0) {
      this.snackBar.open('Please select at least one platform', 'Close', { duration: 3000 });
      return;
    }

    const formattedTexts = new Map<PlatformId, string>();
    const platformNames = new Map<PlatformId, string>();

    this.selectedPlatforms().forEach(platformId => {
      const formatted = this.formatterService.formatForPlatform(
        this.description(),
        this.hashtags(),
        this.url(),
        platformId
      );
      formattedTexts.set(platformId, formatted);
      platformNames.set(platformId, PLATFORM_CONFIGS[platformId].name);
    });

    const success = await this.shareService.copyAllFormattedTexts(formattedTexts, platformNames);

    if (success) {
      this.snackBar.open('All posts copied to clipboard!', 'Close', { duration: 3000 });
    } else {
      this.snackBar.open('Failed to copy to clipboard', 'Close', { duration: 3000 });
    }
  }

  async onGetShareLinks(): Promise<void> {
    if (this.selectedPlatforms().length === 0) {
      this.snackBar.open('Please select at least one platform', 'Close', { duration: 3000 });
      return;
    }

    const formattedTexts = new Map<PlatformId, string>();
    const platformNames = new Map<PlatformId, string>();

    this.selectedPlatforms().forEach(platformId => {
      const formatted = this.formatterService.formatForPlatform(
        this.description(),
        this.hashtags(),
        this.url(),
        platformId
      );
      formattedTexts.set(platformId, formatted);
      platformNames.set(platformId, PLATFORM_CONFIGS[platformId].name);
    });

    const shareUrls = this.shareService.generateAllShareUrls(
      this.selectedPlatforms(),
      formattedTexts,
      this.url()
    );

    const text = this.shareService.formatShareLinksAsText(shareUrls, platformNames);

    try {
      await navigator.clipboard.writeText(text);
      this.snackBar.open('Share links copied to clipboard!', 'Close', { duration: 3000 });
    } catch (error) {
      this.snackBar.open('Failed to copy share links', 'Close', { duration: 3000 });
    }
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
