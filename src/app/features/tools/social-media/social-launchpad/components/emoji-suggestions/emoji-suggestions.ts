import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { EMOJI_SUGGESTIONS, PlatformId, PLATFORM_CONFIGS } from '../../models/platform.model';

@Component({
  selector: 'app-emoji-suggestions',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './emoji-suggestions.html',
  styleUrl: './emoji-suggestions.scss'
})
export class EmojiSuggestionsComponent {
  @Input() selectedPlatforms: PlatformId[] = [];
  @Output() emojiSelect = new EventEmitter<string>();

  professionalEmojis = EMOJI_SUGGESTIONS.professional;
  casualEmojis = EMOJI_SUGGESTIONS.casual;
  engagingEmojis = EMOJI_SUGGESTIONS.engaging;

  get recommendedCategory(): 'professional' | 'casual' | 'engaging' {
    if (this.selectedPlatforms.length === 0) return 'casual';

    const tones = this.selectedPlatforms.map(
      id => PLATFORM_CONFIGS[id].tone
    );

    if (tones.includes('professional')) return 'professional';
    if (tones.includes('engaging')) return 'engaging';
    return 'casual';
  }

  onEmojiClick(emoji: string): void {
    this.emojiSelect.emit(emoji);
  }
}
