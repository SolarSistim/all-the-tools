import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EMOJI_SUGGESTIONS, PlatformId, PLATFORM_CONFIGS } from '../../models/platform.model';

@Component({
  selector: 'app-emoji-suggestions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './emoji-suggestions.html',
  styleUrl: './emoji-suggestions.scss'
})
export class EmojiSuggestionsComponent {
  @Input() selectedPlatforms: PlatformId[] = [];
  @Output() emojiSelect = new EventEmitter<string>();

  searchTerm = signal<string>('');
  searchValue = '';

  allProfessionalEmojis = EMOJI_SUGGESTIONS.professional;
  allCasualEmojis = EMOJI_SUGGESTIONS.casual;
  allEngagingEmojis = EMOJI_SUGGESTIONS.engaging;

  // Emoji keyword mappings for search
  private emojiKeywords: { [key: string]: string[] } = {
    '📊': ['chart', 'graph', 'data', 'analytics', 'statistics', 'stats'],
    '💼': ['briefcase', 'work', 'business', 'professional', 'job'],
    '🎯': ['target', 'goal', 'aim', 'focus', 'bullseye'],
    '✅': ['check', 'done', 'complete', 'yes', 'success'],
    '📈': ['trending', 'up', 'growth', 'increase', 'chart'],
    '🤝': ['handshake', 'deal', 'agreement', 'partnership'],
    '💡': ['idea', 'light', 'bulb', 'innovation', 'think'],
    '🏆': ['trophy', 'winner', 'award', 'achievement', 'success'],
    '🔥': ['fire', 'hot', 'trending', 'lit'],
    '😊': ['smile', 'happy', 'smiley', 'joy'],
    '👀': ['eyes', 'look', 'see', 'watch'],
    '💯': ['hundred', 'perfect', 'full'],
    '🙌': ['hands', 'celebrate', 'praise', 'yay'],
    '❤️': ['heart', 'love', 'like'],
    '✨': ['sparkle', 'shine', 'stars', 'magic'],
    '🚀': ['rocket', 'launch', 'fast', 'space'],
    '🤔': ['think', 'thinking', 'hmm', 'wonder'],
    '👇': ['down', 'below', 'point'],
    '💭': ['thought', 'bubble', 'think'],
    '🎉': ['party', 'celebrate', 'celebration', 'confetti'],
    '⚡': ['lightning', 'fast', 'electric', 'bolt'],
    '🌟': ['star', 'shine', 'bright'],
    '💪': ['strong', 'muscle', 'power', 'strength'],
    '🎊': ['confetti', 'party', 'celebrate']
  };

  professionalEmojis = computed(() => this.filterEmojis(this.allProfessionalEmojis));
  casualEmojis = computed(() => this.filterEmojis(this.allCasualEmojis));
  engagingEmojis = computed(() => this.filterEmojis(this.allEngagingEmojis));

  get recommendedCategory(): 'professional' | 'casual' | 'engaging' {
    if (this.selectedPlatforms.length === 0) return 'casual';

    const tones = this.selectedPlatforms.map(
      id => PLATFORM_CONFIGS[id].tone
    );

    if (tones.includes('professional')) return 'professional';
    if (tones.includes('engaging')) return 'engaging';
    return 'casual';
  }

  private filterEmojis(emojis: string[]): string[] {
    const search = this.searchTerm().toLowerCase().trim();
    if (!search) return emojis;

    return emojis.filter(emoji => {
      const keywords = this.emojiKeywords[emoji] || [];
      return keywords.some(keyword => keyword.includes(search));
    });
  }

  onSearchChange(value: string): void {
    this.searchValue = value;
    this.searchTerm.set(value);
  }

  onEmojiClick(emoji: string): void {
    this.emojiSelect.emit(emoji);
  }

  clearSearch(): void {
    this.searchValue = '';
    this.searchTerm.set('');
  }
}
