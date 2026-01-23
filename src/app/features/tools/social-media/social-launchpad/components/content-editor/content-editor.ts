import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { OGData, PlatformId } from '../../models/platform.model';
import { HashtagInputComponent } from '../hashtag-input/hashtag-input';
import { OGPreviewCardComponent } from '../og-preview-card/og-preview-card';
import { EmojiSuggestionsComponent } from '../emoji-suggestions/emoji-suggestions';

@Component({
  selector: 'app-content-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    HashtagInputComponent,
    OGPreviewCardComponent,
    EmojiSuggestionsComponent
  ],
  templateUrl: './content-editor.html',
  styleUrl: './content-editor.scss'
})
export class ContentEditorComponent implements OnInit, OnDestroy {
  @Input() url: string = '';
  @Input() description: string = '';
  @Input() hashtags: string[] = [];
  @Input() ogData: OGData | null = null;
  @Input() ogLoading: boolean = false;
  @Input() ogError: string | null = null;
  @Input() lowercase: boolean = false;
  @Input() selectedPlatforms: PlatformId[] = [];

  @Output() urlChange = new EventEmitter<string>();
  @Output() descriptionChange = new EventEmitter<string>();
  @Output() hashtagsChange = new EventEmitter<string[]>();
  @Output() fetchOG = new EventEmitter<void>();
  @Output() retryOG = new EventEmitter<void>();
  @Output() cursorPositionChange = new EventEmitter<number>();
  @Output() emojiSelect = new EventEmitter<string>();
  @Output() copyDescription = new EventEmitter<void>();
  @Output() copyHashtags = new EventEmitter<void>();
  @Output() clearAll = new EventEmitter<void>();
  @Output() copyAll = new EventEmitter<void>();

  @ViewChild('descriptionTextarea') descriptionTextarea?: ElementRef<HTMLTextAreaElement>;

  private destroy$ = new Subject<void>();
  private descriptionChange$ = new Subject<string>();
  private snackBar = inject(MatSnackBar);
  cursorPosition: number = 0;

  ngOnInit(): void {
    // Debounce description changes
    this.descriptionChange$
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe(value => {
        this.descriptionChange.emit(value);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onUrlChange(value: string): void {
    this.urlChange.emit(value);
  }

  onDescriptionInput(value: string): void {
    this.descriptionChange$.next(value);
  }

  onDescriptionClick(): void {
    this.updateCursorPosition();
  }

  onDescriptionKeyUp(): void {
    this.updateCursorPosition();
  }

  private updateCursorPosition(): void {
    if (this.descriptionTextarea) {
      this.cursorPosition = this.descriptionTextarea.nativeElement.selectionStart || 0;
      this.cursorPositionChange.emit(this.cursorPosition);
    }
  }

  onHashtagsChange(hashtags: string[]): void {
    this.hashtagsChange.emit(hashtags);
  }

  onFetchOG(): void {
    this.fetchOG.emit();
  }

  onRetryOG(): void {
    this.retryOG.emit();
  }

  isUrlValid(): boolean {
    if (!this.url) return false;
    try {
      new URL(this.url);
      return true;
    } catch {
      return false;
    }
  }

  async onCopyUrl(): Promise<void> {
    if (!this.url) return;
    try {
      await navigator.clipboard.writeText(this.url);
      this.snackBar.open('URL copied to clipboard!', 'Close', { duration: 3000 });
    } catch (error) {
      this.snackBar.open('Failed to copy URL', 'Close', { duration: 3000 });
    }
  }

  onCopyDescription(): void {
    this.copyDescription.emit();
  }

  onCopyHashtags(): void {
    this.copyHashtags.emit();
  }

  onClearAll(): void {
    this.clearAll.emit();
  }

  onCopyAll(): void {
    this.copyAll.emit();
  }

  onEmojiSelect(emoji: string): void {
    this.emojiSelect.emit(emoji);
  }

  clearUrl(): void {
    this.url = '';
    this.urlChange.emit('');
  }
}
