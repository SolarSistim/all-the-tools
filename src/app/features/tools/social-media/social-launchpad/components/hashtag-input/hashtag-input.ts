import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { PlatformFormatterService } from '../../services/platform-formatter.service';

@Component({
  selector: 'app-hashtag-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule
  ],
  templateUrl: './hashtag-input.html',
  styleUrl: './hashtag-input.scss'
})
export class HashtagInputComponent {
  @Input() hashtags: string[] = [];
  @Input() lowercase: boolean = false;
  @Output() hashtagsChange = new EventEmitter<string[]>();

  private formatterService = inject(PlatformFormatterService);

  readonly separatorKeysCodes = [ENTER, COMMA, SPACE] as const;
  currentInput = signal<string>('');

  addHashtag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      const formatted = this.formatterService.formatHashtag(value, this.lowercase);
      if (!this.hashtags.includes(formatted)) {
        this.hashtags.push(formatted);
        this.hashtagsChange.emit(this.hashtags);
      }
    }

    event.chipInput!.clear();
  }

  removeHashtag(hashtag: string): void {
    const index = this.hashtags.indexOf(hashtag);
    if (index >= 0) {
      this.hashtags.splice(index, 1);
      this.hashtagsChange.emit(this.hashtags);
    }
  }

  onInputChange(value: string): void {
    this.currentInput.set(value);
  }
}
