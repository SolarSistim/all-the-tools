import { Component, OnInit, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';
import { ToolCardComponent } from '../../../../shared/components/tool-card/tool-card';
import { CtaEmailList } from '../../../reusable-components/cta-email-list/cta-email-list';
import { AdsenseComponent } from '../../../blog/components/adsense/adsense.component';
import { RelatedBlogPosts } from '../../../reusable-components/related-blog-posts/related-blog-posts';
import { ToolsService } from '../../../../core/services/tools.service';
import { MetaService } from '../../../../core/services/meta.service';
import { CustomSnackbarService } from '../../../../core/services/custom-snackbar.service';

interface AsciiCharacter {
  decimal: number;
  hex: string;
  binary: string;
  char: string;
  name: string;
  category: 'control' | 'printable' | 'symbol' | 'number' | 'uppercase' | 'lowercase' | 'extended' | 'arrows' | 'checkmarks' | 'chess' | 'cards' | 'mahjong' | 'dominos' | 'music' | 'gender' | 'miscellaneous' | 'box-drawing';
  description: string;
  htmlEntity?: string;
}

@Component({
  selector: 'app-ascii-character-reference',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    PageHeaderComponent,
    ToolCardComponent,
    CtaEmailList,
    AdsenseComponent,
    RelatedBlogPosts
  ],
  templateUrl: './ascii-character-reference.html',
  styleUrl: './ascii-character-reference.scss'
})
export class AsciiCharacterReference implements OnInit {
  private toolsService = inject(ToolsService);
  private metaService = inject(MetaService);
  private snackbar = inject(CustomSnackbarService);
  private platformId = inject(PLATFORM_ID);

  relatedBlogPosts = [
    {
      title: 'Base Number Converter Tutorial: Binary, Octal, Decimal, and Hex',
      slug: 'base-number-converter-tutorial'
    }
  ];

  // Signals for reactive state
  searchQuery = signal<string>('');
  selectedCategory = signal<string>('all');
  viewMode = signal<'grid' | 'compact'>(this.getInitialViewMode());

  // ASCII character data
  private asciiCharacters: AsciiCharacter[] = this.generateAsciiTable();

  // Arrow characters collection
  arrowCharacters = [
    { char: '←', name: 'Left Arrow', unicode: 'U+2190' },
    { char: '↑', name: 'Up Arrow', unicode: 'U+2191' },
    { char: '→', name: 'Right Arrow', unicode: 'U+2192' },
    { char: '↓', name: 'Down Arrow', unicode: 'U+2193' },
    { char: '↔', name: 'Left-Right Arrow', unicode: 'U+2194' },
    { char: '↕', name: 'Up-Down Arrow', unicode: 'U+2195' },
    { char: '↖', name: 'Northwest Arrow', unicode: 'U+2196' },
    { char: '↗', name: 'Northeast Arrow', unicode: 'U+2197' },
    { char: '↘', name: 'Southeast Arrow', unicode: 'U+2198' },
    { char: '↙', name: 'Southwest Arrow', unicode: 'U+2199' },
    { char: '⇐', name: 'Double Left Arrow', unicode: 'U+21D0' },
    { char: '⇑', name: 'Double Up Arrow', unicode: 'U+21D1' },
    { char: '⇒', name: 'Double Right Arrow', unicode: 'U+21D2' },
    { char: '⇓', name: 'Double Down Arrow', unicode: 'U+21D3' },
    { char: '⇔', name: 'Double Left-Right Arrow', unicode: 'U+21D4' },
    { char: '⇕', name: 'Double Up-Down Arrow', unicode: 'U+21D5' },
    { char: '⇖', name: 'Double Northwest Arrow', unicode: 'U+21D6' },
    { char: '⇗', name: 'Double Northeast Arrow', unicode: 'U+21D7' },
    { char: '⇘', name: 'Double Southeast Arrow', unicode: 'U+21D8' },
    { char: '⇙', name: 'Double Southwest Arrow', unicode: 'U+21D9' },
    { char: '⟵', name: 'Long Left Arrow', unicode: 'U+27F5' },
    { char: '⟶', name: 'Long Right Arrow', unicode: 'U+27F6' },
    { char: '⟷', name: 'Long Left-Right Arrow', unicode: 'U+27F7' },
    { char: '⟸', name: 'Long Double Left Arrow', unicode: 'U+27F8' },
    { char: '⟹', name: 'Long Double Right Arrow', unicode: 'U+27F9' },
    { char: '⟺', name: 'Long Double Left-Right Arrow', unicode: 'U+27FA' },
    { char: '↩', name: 'Left Arrow with Hook', unicode: 'U+21A9' },
    { char: '↪', name: 'Right Arrow with Hook', unicode: 'U+21AA' },
    { char: '↰', name: 'Up Arrow with Tip Left', unicode: 'U+21B0' },
    { char: '↱', name: 'Up Arrow with Tip Right', unicode: 'U+21B1' },
    { char: '↲', name: 'Down Arrow with Tip Left', unicode: 'U+21B2' },
    { char: '↳', name: 'Down Arrow with Tip Right', unicode: 'U+21B3' },
    { char: '↴', name: 'Right Arrow with Corner Down', unicode: 'U+21B4' },
    { char: '↵', name: 'Down Arrow with Corner Left', unicode: 'U+21B5' },
    { char: '⤴', name: 'Arrow Pointing Right then Up', unicode: 'U+2934' },
    { char: '⤵', name: 'Arrow Pointing Right then Down', unicode: 'U+2935' },
    { char: '▲', name: 'Black Up-Pointing Triangle', unicode: 'U+25B2' },
    { char: '▼', name: 'Black Down-Pointing Triangle', unicode: 'U+25BC' },
    { char: '►', name: 'Black Right-Pointing Triangle', unicode: 'U+25BA' },
    { char: '◄', name: 'Black Left-Pointing Triangle', unicode: 'U+25C4' }
  ];

  // Convert arrow characters to AsciiCharacter format
  private arrowCharactersAsAscii: AsciiCharacter[] = this.arrowCharacters.map((arrow, index) => {
    const unicodeValue = parseInt(arrow.unicode.replace('U+', ''), 16);
    return {
      decimal: unicodeValue,
      hex: unicodeValue.toString(16).toUpperCase().padStart(4, '0'),
      binary: unicodeValue.toString(2).padStart(16, '0'),
      char: arrow.char,
      name: arrow.name,
      category: 'arrows',
      description: `${arrow.name} (${arrow.unicode})`,
      htmlEntity: `&#${unicodeValue};`
    };
  });

  // Checkmark characters collection
  checkmarkCharacters = [
    { char: '\u2713', name: 'Check Mark', unicode: 'U+2713' },
    { char: '\u2714', name: 'Heavy Check Mark', unicode: 'U+2714' },
    { char: '\u2705', name: 'Green Check Mark Emoji', unicode: 'U+2705' },
    { char: '\u2610', name: 'Ballot Box (Empty)', unicode: 'U+2610' },
    { char: '\u2611', name: 'Ballot Box with Check', unicode: 'U+2611' },
    { char: '\u2612', name: 'Ballot Box with X', unicode: 'U+2612' },
    { char: '\u2715', name: 'Multiplication X', unicode: 'U+2715' },
    { char: '\u2716', name: 'Heavy Multiplication X', unicode: 'U+2716' },
    { char: '\u2717', name: 'Ballot X', unicode: 'U+2717' },
    { char: '\u2718', name: 'Heavy Ballot X', unicode: 'U+2718' },
    { char: '\u274C', name: 'Cross Mark Emoji', unicode: 'U+274C' },
    { char: '\u274E', name: 'Cross Mark in Box Emoji', unicode: 'U+274E' },
    { char: '\u2720', name: 'Maltese Cross', unicode: 'U+2720' },
    { char: '\u2BBD', name: 'Ballot Box with Light X', unicode: 'U+2BBD' },
    { char: '\u2B55', name: 'Heavy Large Circle', unicode: 'U+2B55' },
    { char: '\u2573', name: 'Box Drawings Light Diagonal Cross', unicode: 'U+2573' },
    { char: '\u237B', name: 'Not Check Mark', unicode: 'U+237B' },
    { char: '\u2319', name: 'Turned Not Sign', unicode: 'U+2319' },
  ];

  // Convert checkmark characters to AsciiCharacter format
  private checkmarkCharactersAsAscii: AsciiCharacter[] = this.checkmarkCharacters.map((check) => {
    const unicodeValue = parseInt(check.unicode.replace('U+', ''), 16);
    return {
      decimal: unicodeValue,
      hex: unicodeValue.toString(16).toUpperCase().padStart(4, '0'),
      binary: unicodeValue.toString(2).padStart(16, '0'),
      char: check.char,
      name: check.name,
      category: 'checkmarks' as const,
      description: `${check.name} (${check.unicode})`,
      htmlEntity: `&#${unicodeValue};`
    };
  });

  // Chess characters collection
  chessCharacters = [
    { char: '♔', name: 'White King', unicode: 'U+2654', htmlDec: '&#9812' },
    { char: '♕', name: 'White Queen', unicode: 'U+2655', htmlDec: '&#9813' },
    { char: '♖', name: 'White Rook', unicode: 'U+2656', htmlDec: '&#9814' },
    { char: '♗', name: 'White Bishop', unicode: 'U+2657', htmlDec: '&#9815' },
    { char: '♘', name: 'White Knight', unicode: 'U+2658', htmlDec: '&#9816' },
    { char: '♙', name: 'White Pawn', unicode: 'U+2659', htmlDec: '&#9817' },
    { char: '♚', name: 'Black King', unicode: 'U+265A', htmlDec: '&#9818' },
    { char: '♛', name: 'Black Queen', unicode: 'U+265B', htmlDec: '&#9819' },
    { char: '♜', name: 'Black Rook', unicode: 'U+265C', htmlDec: '&#9820' },
    { char: '♝', name: 'Black Bishop', unicode: 'U+265D', htmlDec: '&#9821' },
    { char: '♞', name: 'Black Knight', unicode: 'U+265E', htmlDec: '&#9822' },
    { char: '♟', name: 'Black Pawn', unicode: 'U+265F', htmlDec: '&#9823' }
  ];

  // Convert chess characters to AsciiCharacter format
  private chessCharactersAsAscii: AsciiCharacter[] = this.chessCharacters.map((chess) => {
    const unicodeValue = parseInt(chess.unicode.replace('U+', ''), 16);
    return {
      decimal: unicodeValue,
      hex: unicodeValue.toString(16).toUpperCase().padStart(4, '0'),
      binary: unicodeValue.toString(2).padStart(16, '0'),
      char: chess.char,
      name: chess.name,
      category: 'chess' as const,
      description: `${chess.name} (${chess.unicode})`,
      htmlEntity: `&#${unicodeValue};`
    };
  });

  // Playing cards collection - comprehensive playing card emojis
  playingCardsSuits = [
    { char: '🂠', name: 'Playing Card Back', unicode: 'U+1F0A0' },
    // Suit symbols
    { char: '♠', name: 'Black Spade Suit', unicode: 'U+2660' },
    { char: '♥', name: 'Black Heart Suit', unicode: 'U+2665' },
    { char: '♦', name: 'Black Diamond Suit', unicode: 'U+2666' },
    { char: '♣', name: 'Black Club Suit', unicode: 'U+2663' },
    // Spades (Ace - King)
    { char: '🂡', name: 'Playing Card Ace Of Spades', unicode: 'U+1F0A1' },
    { char: '🂢', name: 'Playing Card Two Of Spades', unicode: 'U+1F0A2' },
    { char: '🂣', name: 'Playing Card Three Of Spades', unicode: 'U+1F0A3' },
    { char: '🂤', name: 'Playing Card Four Of Spades', unicode: 'U+1F0A4' },
    { char: '🂥', name: 'Playing Card Five Of Spades', unicode: 'U+1F0A5' },
    { char: '🂦', name: 'Playing Card Six Of Spades', unicode: 'U+1F0A6' },
    { char: '🂧', name: 'Playing Card Seven Of Spades', unicode: 'U+1F0A7' },
    { char: '🂨', name: 'Playing Card Eight Of Spades', unicode: 'U+1F0A8' },
    { char: '🂩', name: 'Playing Card Nine Of Spades', unicode: 'U+1F0A9' },
    { char: '🂪', name: 'Playing Card Ten Of Spades', unicode: 'U+1F0AA' },
    { char: '🂫', name: 'Playing Card Jack Of Spades', unicode: 'U+1F0AB' },
    { char: '🂬', name: 'Playing Card Knight Of Spades', unicode: 'U+1F0AC' },
    { char: '🂭', name: 'Playing Card Queen Of Spades', unicode: 'U+1F0AD' },
    { char: '🂮', name: 'Playing Card King Of Spades', unicode: 'U+1F0AE' },
    // Hearts (Ace - King)
    { char: '🂱', name: 'Playing Card Ace Of Hearts', unicode: 'U+1F0B1' },
    { char: '🂲', name: 'Playing Card Two Of Hearts', unicode: 'U+1F0B2' },
    { char: '🂳', name: 'Playing Card Three Of Hearts', unicode: 'U+1F0B3' },
    { char: '🂴', name: 'Playing Card Four Of Hearts', unicode: 'U+1F0B4' },
    { char: '🂵', name: 'Playing Card Five Of Hearts', unicode: 'U+1F0B5' },
    { char: '🂶', name: 'Playing Card Six Of Hearts', unicode: 'U+1F0B6' },
    { char: '🂷', name: 'Playing Card Seven Of Hearts', unicode: 'U+1F0B7' },
    { char: '🂸', name: 'Playing Card Eight Of Hearts', unicode: 'U+1F0B8' },
    { char: '🂹', name: 'Playing Card Nine Of Hearts', unicode: 'U+1F0B9' },
    { char: '🂺', name: 'Playing Card Ten Of Hearts', unicode: 'U+1F0BA' },
    { char: '🂻', name: 'Playing Card Jack Of Hearts', unicode: 'U+1F0BB' },
    { char: '🂼', name: 'Playing Card Knight Of Hearts', unicode: 'U+1F0BC' },
    { char: '🂽', name: 'Playing Card Queen Of Hearts', unicode: 'U+1F0BD' },
    { char: '🂾', name: 'Playing Card King Of Hearts', unicode: 'U+1F0BE' },
    { char: '🂿', name: 'Playing Card Red Joker', unicode: 'U+1F0BF' },
    // Diamonds (Ace - King)
    { char: '🃁', name: 'Playing Card Ace Of Diamonds', unicode: 'U+1F0C1' },
    { char: '🃂', name: 'Playing Card Two Of Diamonds', unicode: 'U+1F0C2' },
    { char: '🃃', name: 'Playing Card Three Of Diamonds', unicode: 'U+1F0C3' },
    { char: '🃄', name: 'Playing Card Four Of Diamonds', unicode: 'U+1F0C4' },
    { char: '🃅', name: 'Playing Card Five Of Diamonds', unicode: 'U+1F0C5' },
    { char: '🃆', name: 'Playing Card Six Of Diamonds', unicode: 'U+1F0C6' },
    { char: '🃇', name: 'Playing Card Seven Of Diamonds', unicode: 'U+1F0C7' },
    { char: '🃈', name: 'Playing Card Eight Of Diamonds', unicode: 'U+1F0C8' },
    { char: '🃉', name: 'Playing Card Nine Of Diamonds', unicode: 'U+1F0C9' },
    { char: '🃊', name: 'Playing Card Ten Of Diamonds', unicode: 'U+1F0CA' },
    { char: '🃋', name: 'Playing Card Jack Of Diamonds', unicode: 'U+1F0CB' },
    { char: '🃌', name: 'Playing Card Knight Of Diamonds', unicode: 'U+1F0CC' },
    { char: '🃍', name: 'Playing Card Queen Of Diamonds', unicode: 'U+1F0CD' },
    { char: '🃎', name: 'Playing Card King Of Diamonds', unicode: 'U+1F0CE' },
    { char: '🃏', name: 'Playing Card Black Joker', unicode: 'U+1F0CF' },
    // Clubs (Ace - King)
    { char: '🃑', name: 'Playing Card Ace Of Clubs', unicode: 'U+1F0D1' },
    { char: '🃒', name: 'Playing Card Two Of Clubs', unicode: 'U+1F0D2' },
    { char: '🃓', name: 'Playing Card Three Of Clubs', unicode: 'U+1F0D3' },
    { char: '🃔', name: 'Playing Card Four Of Clubs', unicode: 'U+1F0D4' },
    { char: '🃕', name: 'Playing Card Five Of Clubs', unicode: 'U+1F0D5' },
    { char: '🃖', name: 'Playing Card Six Of Clubs', unicode: 'U+1F0D6' },
    { char: '🃗', name: 'Playing Card Seven Of Clubs', unicode: 'U+1F0D7' },
    { char: '🃘', name: 'Playing Card Eight Of Clubs', unicode: 'U+1F0D8' },
    { char: '🃙', name: 'Playing Card Nine Of Clubs', unicode: 'U+1F0D9' },
    { char: '🃚', name: 'Playing Card Ten Of Clubs', unicode: 'U+1F0DA' },
    { char: '🃛', name: 'Playing Card Jack Of Clubs', unicode: 'U+1F0DB' },
    { char: '🃜', name: 'Playing Card Knight Of Clubs', unicode: 'U+1F0DC' },
    { char: '🃝', name: 'Playing Card Queen Of Clubs', unicode: 'U+1F0DD' },
    { char: '🃞', name: 'Playing Card King Of Clubs', unicode: 'U+1F0DE' },
    { char: '🃟', name: 'Playing Card White Joker', unicode: 'U+1F0DF' },
    // Tarot and Special Cards
    { char: '🃠', name: 'Playing Card Fool', unicode: 'U+1F0E0' },
    { char: '🃡', name: 'Playing Card Trump-1', unicode: 'U+1F0E1' },
    { char: '🃢', name: 'Playing Card Trump-2', unicode: 'U+1F0E2' },
    { char: '🃣', name: 'Playing Card Trump-3', unicode: 'U+1F0E3' },
    { char: '🃤', name: 'Playing Card Trump-4', unicode: 'U+1F0E4' },
    { char: '🃥', name: 'Playing Card Trump-5', unicode: 'U+1F0E5' },
    { char: '🃦', name: 'Playing Card Trump-6', unicode: 'U+1F0E6' },
    { char: '🃧', name: 'Playing Card Trump-7', unicode: 'U+1F0E7' },
    { char: '🃨', name: 'Playing Card Trump-8', unicode: 'U+1F0E8' },
    { char: '🃩', name: 'Playing Card Trump-9', unicode: 'U+1F0E9' },
    { char: '🃪', name: 'Playing Card Trump-10', unicode: 'U+1F0EA' },
    { char: '🃫', name: 'Playing Card Trump-11', unicode: 'U+1F0EB' },
    { char: '🃬', name: 'Playing Card Trump-12', unicode: 'U+1F0EC' },
    { char: '🃭', name: 'Playing Card Trump-13', unicode: 'U+1F0ED' },
    { char: '🃮', name: 'Playing Card Trump-14', unicode: 'U+1F0EE' },
    { char: '🃯', name: 'Playing Card Trump-15', unicode: 'U+1F0EF' },
    { char: '🃰', name: 'Playing Card Trump-16', unicode: 'U+1F0F0' },
    { char: '🃱', name: 'Playing Card Trump-17', unicode: 'U+1F0F1' },
    { char: '🃲', name: 'Playing Card Trump-18', unicode: 'U+1F0F2' },
    { char: '🃳', name: 'Playing Card Trump-19', unicode: 'U+1F0F3' },
    { char: '🃴', name: 'Playing Card Trump-20', unicode: 'U+1F0F4' },
    { char: '🃵', name: 'Playing Card Trump-21', unicode: 'U+1F0F5' }
  ];

  // Convert playing cards to AsciiCharacter format
  private playingCardsSuitsAsAscii: AsciiCharacter[] = this.playingCardsSuits.map((card) => {
    const unicodeValue = parseInt(card.unicode.replace('U+', ''), 16);
    return {
      decimal: unicodeValue,
      hex: unicodeValue.toString(16).toUpperCase().padStart(4, '0'),
      binary: unicodeValue.toString(2).padStart(16, '0'),
      char: card.char,
      name: card.name,
      category: 'cards' as const,
      description: `${card.name} (${card.unicode})`,
      htmlEntity: `&#${unicodeValue};`
    };
  });

  // Mahjong tiles collection
  mahjongTiles = [
    { char: '🀀', name: 'Mahjong Tile East Wind', unicode: 'U+1F000' },
    { char: '🀁', name: 'Mahjong Tile South Wind', unicode: 'U+1F001' },
    { char: '🀂', name: 'Mahjong Tile West Wind', unicode: 'U+1F002' },
    { char: '🀃', name: 'Mahjong Tile North Wind', unicode: 'U+1F003' },
    { char: '🀄', name: 'Mahjong Tile Red Dragon', unicode: 'U+1F004' },
    { char: '🀅', name: 'Mahjong Tile Green Dragon', unicode: 'U+1F005' },
    { char: '🀆', name: 'Mahjong Tile White Dragon', unicode: 'U+1F006' },
    { char: '🀇', name: 'Mahjong Tile One Of Characters', unicode: 'U+1F007' },
    { char: '🀈', name: 'Mahjong Tile Two Of Characters', unicode: 'U+1F008' },
    { char: '🀉', name: 'Mahjong Tile Three Of Characters', unicode: 'U+1F009' },
    { char: '🀊', name: 'Mahjong Tile Four Of Characters', unicode: 'U+1F00A' },
    { char: '🀋', name: 'Mahjong Tile Five Of Characters', unicode: 'U+1F00B' },
    { char: '🀌', name: 'Mahjong Tile Six Of Characters', unicode: 'U+1F00C' },
    { char: '🀍', name: 'Mahjong Tile Seven Of Characters', unicode: 'U+1F00D' },
    { char: '🀎', name: 'Mahjong Tile Eight Of Characters', unicode: 'U+1F00E' },
    { char: '🀏', name: 'Mahjong Tile Nine Of Characters', unicode: 'U+1F00F' },
    { char: '🀐', name: 'Mahjong Tile One Of Bamboos', unicode: 'U+1F010' },
    { char: '🀑', name: 'Mahjong Tile Two Of Bamboos', unicode: 'U+1F011' },
    { char: '🀒', name: 'Mahjong Tile Three Of Bamboos', unicode: 'U+1F012' },
    { char: '🀓', name: 'Mahjong Tile Four Of Bamboos', unicode: 'U+1F013' },
    { char: '🀔', name: 'Mahjong Tile Five Of Bamboos', unicode: 'U+1F014' },
    { char: '🀕', name: 'Mahjong Tile Six Of Bamboos', unicode: 'U+1F015' },
    { char: '🀖', name: 'Mahjong Tile Seven Of Bamboos', unicode: 'U+1F016' },
    { char: '🀗', name: 'Mahjong Tile Eight Of Bamboos', unicode: 'U+1F017' },
    { char: '🀘', name: 'Mahjong Tile Nine Of Bamboos', unicode: 'U+1F018' },
    { char: '🀙', name: 'Mahjong Tile One Of Circles', unicode: 'U+1F019' },
    { char: '🀚', name: 'Mahjong Tile Two Of Circles', unicode: 'U+1F01A' },
    { char: '🀛', name: 'Mahjong Tile Three Of Circles', unicode: 'U+1F01B' },
    { char: '🀜', name: 'Mahjong Tile Four Of Circles', unicode: 'U+1F01C' },
    { char: '🀝', name: 'Mahjong Tile Five Of Circles', unicode: 'U+1F01D' },
    { char: '🀞', name: 'Mahjong Tile Six Of Circles', unicode: 'U+1F01E' },
    { char: '🀟', name: 'Mahjong Tile Seven Of Circles', unicode: 'U+1F01F' },
    { char: '🀠', name: 'Mahjong Tile Eight Of Circles', unicode: 'U+1F020' },
    { char: '🀡', name: 'Mahjong Tile Nine Of Circles', unicode: 'U+1F021' },
    { char: '🀢', name: 'Mahjong Tile Plum', unicode: 'U+1F022' },
    { char: '🀣', name: 'Mahjong Tile Orchid', unicode: 'U+1F023' },
    { char: '🀤', name: 'Mahjong Tile Bamboo', unicode: 'U+1F024' },
    { char: '🀥', name: 'Mahjong Tile Chrysanthemum', unicode: 'U+1F025' },
    { char: '🀦', name: 'Mahjong Tile Spring', unicode: 'U+1F026' },
    { char: '🀧', name: 'Mahjong Tile Summer', unicode: 'U+1F027' },
    { char: '🀨', name: 'Mahjong Tile Autumn', unicode: 'U+1F028' },
    { char: '🀩', name: 'Mahjong Tile Winter', unicode: 'U+1F029' },
    { char: '🀪', name: 'Mahjong Tile Joker', unicode: 'U+1F02A' },
    { char: '🀫', name: 'Mahjong Tile Back', unicode: 'U+1F02B' }
  ];

  // Convert mahjong tiles to AsciiCharacter format
  private mahjongTilesAsAscii: AsciiCharacter[] = this.mahjongTiles.map((tile) => {
    const unicodeValue = parseInt(tile.unicode.replace('U+', ''), 16);
    return {
      decimal: unicodeValue,
      hex: unicodeValue.toString(16).toUpperCase().padStart(4, '0'),
      binary: unicodeValue.toString(2).padStart(16, '0'),
      char: tile.char,
      name: tile.name,
      category: 'mahjong' as const,
      description: `${tile.name} (${tile.unicode})`,
      htmlEntity: `&#${unicodeValue};`
    };
  });

  // Domino tiles collection
  dominoTiles = [
    // Horizontal dominoes
    { char: '🀰', name: 'Domino Tile Horizontal Back', unicode: 'U+1F030' },
    { char: '🀱', name: 'Domino Tile Horizontal-00-00', unicode: 'U+1F031' },
    { char: '🀲', name: 'Domino Tile Horizontal-00-01', unicode: 'U+1F032' },
    { char: '🀳', name: 'Domino Tile Horizontal-00-02', unicode: 'U+1F033' },
    { char: '🀴', name: 'Domino Tile Horizontal-00-03', unicode: 'U+1F034' },
    { char: '🀵', name: 'Domino Tile Horizontal-00-04', unicode: 'U+1F035' },
    { char: '🀶', name: 'Domino Tile Horizontal-00-05', unicode: 'U+1F036' },
    { char: '🀷', name: 'Domino Tile Horizontal-00-06', unicode: 'U+1F037' },
    { char: '🀸', name: 'Domino Tile Horizontal-01-00', unicode: 'U+1F038' },
    { char: '🀹', name: 'Domino Tile Horizontal-01-01', unicode: 'U+1F039' },
    { char: '🀺', name: 'Domino Tile Horizontal-01-02', unicode: 'U+1F03A' },
    { char: '🀻', name: 'Domino Tile Horizontal-01-03', unicode: 'U+1F03B' },
    { char: '🀼', name: 'Domino Tile Horizontal-01-04', unicode: 'U+1F03C' },
    { char: '🀽', name: 'Domino Tile Horizontal-01-05', unicode: 'U+1F03D' },
    { char: '🀾', name: 'Domino Tile Horizontal-01-06', unicode: 'U+1F03E' },
    { char: '🀿', name: 'Domino Tile Horizontal-02-00', unicode: 'U+1F03F' },
    { char: '🁀', name: 'Domino Tile Horizontal-02-01', unicode: 'U+1F040' },
    { char: '🁁', name: 'Domino Tile Horizontal-02-02', unicode: 'U+1F041' },
    { char: '🁂', name: 'Domino Tile Horizontal-02-03', unicode: 'U+1F042' },
    { char: '🁃', name: 'Domino Tile Horizontal-02-04', unicode: 'U+1F043' },
    { char: '🁄', name: 'Domino Tile Horizontal-02-05', unicode: 'U+1F044' },
    { char: '🁅', name: 'Domino Tile Horizontal-02-06', unicode: 'U+1F045' },
    { char: '🁆', name: 'Domino Tile Horizontal-03-00', unicode: 'U+1F046' },
    { char: '🁇', name: 'Domino Tile Horizontal-03-01', unicode: 'U+1F047' },
    { char: '🁈', name: 'Domino Tile Horizontal-03-02', unicode: 'U+1F048' },
    { char: '🁉', name: 'Domino Tile Horizontal-03-03', unicode: 'U+1F049' },
    { char: '🁊', name: 'Domino Tile Horizontal-03-04', unicode: 'U+1F04A' },
    { char: '🁋', name: 'Domino Tile Horizontal-03-05', unicode: 'U+1F04B' },
    { char: '🁌', name: 'Domino Tile Horizontal-03-06', unicode: 'U+1F04C' },
    { char: '🁍', name: 'Domino Tile Horizontal-04-00', unicode: 'U+1F04D' },
    { char: '🁎', name: 'Domino Tile Horizontal-04-01', unicode: 'U+1F04E' },
    { char: '🁏', name: 'Domino Tile Horizontal-04-02', unicode: 'U+1F04F' },
    { char: '🁐', name: 'Domino Tile Horizontal-04-03', unicode: 'U+1F050' },
    { char: '🁑', name: 'Domino Tile Horizontal-04-04', unicode: 'U+1F051' },
    { char: '🁒', name: 'Domino Tile Horizontal-04-05', unicode: 'U+1F052' },
    { char: '🁓', name: 'Domino Tile Horizontal-04-06', unicode: 'U+1F053' },
    { char: '🁔', name: 'Domino Tile Horizontal-05-00', unicode: 'U+1F054' },
    { char: '🁕', name: 'Domino Tile Horizontal-05-01', unicode: 'U+1F055' },
    { char: '🁖', name: 'Domino Tile Horizontal-05-02', unicode: 'U+1F056' },
    { char: '🁗', name: 'Domino Tile Horizontal-05-03', unicode: 'U+1F057' },
    { char: '🁘', name: 'Domino Tile Horizontal-05-04', unicode: 'U+1F058' },
    { char: '🁙', name: 'Domino Tile Horizontal-05-05', unicode: 'U+1F059' },
    { char: '🁚', name: 'Domino Tile Horizontal-05-06', unicode: 'U+1F05A' },
    { char: '🁛', name: 'Domino Tile Horizontal-06-00', unicode: 'U+1F05B' },
    { char: '🁜', name: 'Domino Tile Horizontal-06-01', unicode: 'U+1F05C' },
    { char: '🁝', name: 'Domino Tile Horizontal-06-02', unicode: 'U+1F05D' },
    { char: '🁞', name: 'Domino Tile Horizontal-06-03', unicode: 'U+1F05E' },
    { char: '🁟', name: 'Domino Tile Horizontal-06-04', unicode: 'U+1F05F' },
    { char: '🁠', name: 'Domino Tile Horizontal-06-05', unicode: 'U+1F060' },
    { char: '🁡', name: 'Domino Tile Horizontal-06-06', unicode: 'U+1F061' },
    // Vertical dominoes
    { char: '🁢', name: 'Domino Tile Vertical Back', unicode: 'U+1F062' },
    { char: '🁣', name: 'Domino Tile Vertical-00-00', unicode: 'U+1F063' },
    { char: '🁤', name: 'Domino Tile Vertical-00-01', unicode: 'U+1F064' },
    { char: '🁥', name: 'Domino Tile Vertical-00-02', unicode: 'U+1F065' },
    { char: '🁦', name: 'Domino Tile Vertical-00-03', unicode: 'U+1F066' },
    { char: '🁧', name: 'Domino Tile Vertical-00-04', unicode: 'U+1F067' },
    { char: '🁨', name: 'Domino Tile Vertical-00-05', unicode: 'U+1F068' },
    { char: '🁩', name: 'Domino Tile Vertical-00-06', unicode: 'U+1F069' },
    { char: '🁪', name: 'Domino Tile Vertical-01-00', unicode: 'U+1F06A' },
    { char: '🁫', name: 'Domino Tile Vertical-01-01', unicode: 'U+1F06B' },
    { char: '🁬', name: 'Domino Tile Vertical-01-02', unicode: 'U+1F06C' },
    { char: '🁭', name: 'Domino Tile Vertical-01-03', unicode: 'U+1F06D' },
    { char: '🁮', name: 'Domino Tile Vertical-01-04', unicode: 'U+1F06E' },
    { char: '🁯', name: 'Domino Tile Vertical-01-05', unicode: 'U+1F06F' },
    { char: '🁰', name: 'Domino Tile Vertical-01-06', unicode: 'U+1F070' },
    { char: '🁱', name: 'Domino Tile Vertical-02-00', unicode: 'U+1F071' },
    { char: '🁲', name: 'Domino Tile Vertical-02-01', unicode: 'U+1F072' },
    { char: '🁳', name: 'Domino Tile Vertical-02-02', unicode: 'U+1F073' },
    { char: '🁴', name: 'Domino Tile Vertical-02-03', unicode: 'U+1F074' },
    { char: '🁵', name: 'Domino Tile Vertical-02-04', unicode: 'U+1F075' },
    { char: '🁶', name: 'Domino Tile Vertical-02-05', unicode: 'U+1F076' },
    { char: '🁷', name: 'Domino Tile Vertical-02-06', unicode: 'U+1F077' },
    { char: '🁸', name: 'Domino Tile Vertical-03-00', unicode: 'U+1F078' },
    { char: '🁹', name: 'Domino Tile Vertical-03-01', unicode: 'U+1F079' },
    { char: '🁺', name: 'Domino Tile Vertical-03-02', unicode: 'U+1F07A' },
    { char: '🁻', name: 'Domino Tile Vertical-03-03', unicode: 'U+1F07B' },
    { char: '🁼', name: 'Domino Tile Vertical-03-04', unicode: 'U+1F07C' },
    { char: '🁽', name: 'Domino Tile Vertical-03-05', unicode: 'U+1F07D' },
    { char: '🁾', name: 'Domino Tile Vertical-03-06', unicode: 'U+1F07E' },
    { char: '🁿', name: 'Domino Tile Vertical-04-00', unicode: 'U+1F07F' },
    { char: '🂀', name: 'Domino Tile Vertical-04-01', unicode: 'U+1F080' },
    { char: '🂁', name: 'Domino Tile Vertical-04-02', unicode: 'U+1F081' },
    { char: '🂂', name: 'Domino Tile Vertical-04-03', unicode: 'U+1F082' },
    { char: '🂃', name: 'Domino Tile Vertical-04-04', unicode: 'U+1F083' },
    { char: '🂄', name: 'Domino Tile Vertical-04-05', unicode: 'U+1F084' },
    { char: '🂅', name: 'Domino Tile Vertical-04-06', unicode: 'U+1F085' },
    { char: '🂆', name: 'Domino Tile Vertical-05-00', unicode: 'U+1F086' },
    { char: '🂇', name: 'Domino Tile Vertical-05-01', unicode: 'U+1F087' },
    { char: '🂈', name: 'Domino Tile Vertical-05-02', unicode: 'U+1F088' },
    { char: '🂉', name: 'Domino Tile Vertical-05-03', unicode: 'U+1F089' },
    { char: '🂊', name: 'Domino Tile Vertical-05-04', unicode: 'U+1F08A' },
    { char: '🂋', name: 'Domino Tile Vertical-05-05', unicode: 'U+1F08B' },
    { char: '🂌', name: 'Domino Tile Vertical-05-06', unicode: 'U+1F08C' },
    { char: '🂍', name: 'Domino Tile Vertical-06-00', unicode: 'U+1F08D' },
    { char: '🂎', name: 'Domino Tile Vertical-06-01', unicode: 'U+1F08E' },
    { char: '🂏', name: 'Domino Tile Vertical-06-02', unicode: 'U+1F08F' },
    { char: '🂐', name: 'Domino Tile Vertical-06-03', unicode: 'U+1F090' },
    { char: '🂑', name: 'Domino Tile Vertical-06-04', unicode: 'U+1F091' },
    { char: '🂒', name: 'Domino Tile Vertical-06-05', unicode: 'U+1F092' },
    { char: '🂓', name: 'Domino Tile Vertical-06-06', unicode: 'U+1F093' }
  ];

  // Convert domino tiles to AsciiCharacter format
  private dominoTilesAsAscii: AsciiCharacter[] = this.dominoTiles.map((tile) => {
    const unicodeValue = parseInt(tile.unicode.replace('U+', ''), 16);
    return {
      decimal: unicodeValue,
      hex: unicodeValue.toString(16).toUpperCase().padStart(4, '0'),
      binary: unicodeValue.toString(2).padStart(16, '0'),
      char: tile.char,
      name: tile.name,
      category: 'dominos' as const,
      description: `${tile.name} (${tile.unicode})`,
      htmlEntity: `&#${unicodeValue};`
    };
  });

  // Music symbols collection
  musicSymbols = [
    { char: '♪', name: 'Musical Note', unicode: 'U+266A' },
    { char: '♫', name: 'Beamed Eighth Notes', unicode: 'U+266B' }
  ];

  // Convert music symbols to AsciiCharacter format
  private musicSymbolsAsAscii: AsciiCharacter[] = this.musicSymbols.map((sym) => {
    const unicodeValue = parseInt(sym.unicode.replace('U+', ''), 16);
    return {
      decimal: unicodeValue,
      hex: unicodeValue.toString(16).toUpperCase().padStart(4, '0'),
      binary: unicodeValue.toString(2).padStart(16, '0'),
      char: sym.char,
      name: sym.name,
      category: 'music' as const,
      description: `${sym.name} (${sym.unicode})`,
      htmlEntity: `&#${unicodeValue};`
    };
  });

  // Gender symbols collection
  genderSymbols = [
    { char: '♂', name: 'Male Sign', unicode: 'U+2642' },
    { char: '♀', name: 'Female Sign', unicode: 'U+2640' }
  ];

  // Convert gender symbols to AsciiCharacter format
  private genderSymbolsAsAscii: AsciiCharacter[] = this.genderSymbols.map((sym) => {
    const unicodeValue = parseInt(sym.unicode.replace('U+', ''), 16);
    return {
      decimal: unicodeValue,
      hex: unicodeValue.toString(16).toUpperCase().padStart(4, '0'),
      binary: unicodeValue.toString(2).padStart(16, '0'),
      char: sym.char,
      name: sym.name,
      category: 'gender' as const,
      description: `${sym.name} (${sym.unicode})`,
      htmlEntity: `&#${unicodeValue};`
    };
  });

  // Box drawing and lines collection
  boxDrawingSymbols = [
    { char: '┐', name: 'Box Drawings Light Down and Left', unicode: 'U+2510' },
    { char: '└', name: 'Box Drawings Light Up and Right', unicode: 'U+2514' },
    { char: '┴', name: 'Box Drawings Light Up and Horizontal', unicode: 'U+2534' },
    { char: '┬', name: 'Box Drawings Light Down and Horizontal', unicode: 'U+252C' },
    { char: '├', name: 'Box Drawings Light Vertical and Right', unicode: 'U+251C' },
    { char: '─', name: 'Box Drawings Light Horizontal', unicode: 'U+2500' },
    { char: '┼', name: 'Box Drawings Light Vertical and Horizontal', unicode: 'U+253C' },
    { char: '═', name: 'Box Drawings Double Horizontal', unicode: 'U+2550' },
    { char: '║', name: 'Box Drawings Double Vertical', unicode: 'U+2551' },
    { char: '╔', name: 'Box Drawings Double Down and Right', unicode: 'U+2554' },
    { char: '╗', name: 'Box Drawings Double Down and Left', unicode: 'U+2557' },
    { char: '╚', name: 'Box Drawings Double Up and Right', unicode: 'U+255A' },
    { char: '╝', name: 'Box Drawings Double Up and Left', unicode: 'U+255D' }
  ];

  // Convert box drawing symbols to AsciiCharacter format
  private boxDrawingSymbolsAsAscii: AsciiCharacter[] = this.boxDrawingSymbols.map((sym) => {
    const unicodeValue = parseInt(sym.unicode.replace('U+', ''), 16);
    return {
      decimal: unicodeValue,
      hex: unicodeValue.toString(16).toUpperCase().padStart(4, '0'),
      binary: unicodeValue.toString(2).padStart(16, '0'),
      char: sym.char,
      name: sym.name,
      category: 'box-drawing' as const,
      description: `${sym.name} (${sym.unicode})`,
      htmlEntity: `&#${unicodeValue};`
    };
  });

  // Miscellaneous symbols collection (Unicode, not ASCII 0-255 to avoid duplicates)
  miscellaneousSymbols = [
    { char: '☺', name: 'White Smiling Face', unicode: 'U+263A' },
    { char: '☻', name: 'Black Smiling Face', unicode: 'U+263B' },
    { char: '○', name: 'White Circle', unicode: 'U+25CB' },
    { char: '◘', name: 'Inverse Bullet', unicode: 'U+25D8' },
    { char: '◙', name: 'Inverse White Circle', unicode: 'U+25D9' },
    { char: '☼', name: 'White Sun with Rays', unicode: 'U+263C' },
    { char: '◎', name: 'Bullseye', unicode: 'U+25CE' },
    { char: '▬', name: 'Black Rectangle', unicode: 'U+25AC' }
  ];

  // Convert miscellaneous symbols to AsciiCharacter format
  private miscellaneousSymbolsAsAscii: AsciiCharacter[] = this.miscellaneousSymbols.map((sym) => {
    const unicodeValue = parseInt(sym.unicode.replace('U+', ''), 16);
    return {
      decimal: unicodeValue,
      hex: unicodeValue.toString(16).toUpperCase().padStart(4, '0'),
      binary: unicodeValue.toString(2).padStart(16, '0'),
      char: sym.char,
      name: sym.name,
      category: 'miscellaneous' as const,
      description: `${sym.name} (${sym.unicode})`,
      htmlEntity: `&#${unicodeValue};`
    };
  });

  // Computed total characters count
  totalCharactersCount = computed(() => {
    return this.asciiCharacters.length +
           this.arrowCharactersAsAscii.length +
           this.checkmarkCharactersAsAscii.length +
           this.chessCharactersAsAscii.length +
           this.playingCardsSuitsAsAscii.length +
           this.mahjongTilesAsAscii.length +
           this.dominoTilesAsAscii.length +
           this.musicSymbolsAsAscii.length +
           this.genderSymbolsAsAscii.length +
           this.boxDrawingSymbolsAsAscii.length +
           this.miscellaneousSymbolsAsAscii.length;
  });

  // Computed filtered characters
  filteredCharacters = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const category = this.selectedCategory();

    // Combine all character collections
    let allCharacters = [
      ...this.asciiCharacters,
      ...this.arrowCharactersAsAscii,
      ...this.checkmarkCharactersAsAscii,
      ...this.chessCharactersAsAscii,
      ...this.playingCardsSuitsAsAscii,
      ...this.mahjongTilesAsAscii,
      ...this.dominoTilesAsAscii,
      ...this.musicSymbolsAsAscii,
      ...this.genderSymbolsAsAscii,
      ...this.boxDrawingSymbolsAsAscii,
      ...this.miscellaneousSymbolsAsAscii
    ];

    return allCharacters.filter(char => {
      const matchesSearch = !query ||
        char.decimal.toString().includes(query) ||
        char.hex.toLowerCase().includes(query) ||
        char.name.toLowerCase().includes(query) ||
        char.char.toLowerCase().includes(query) ||
        char.description.toLowerCase().includes(query);

      const matchesCategory = category === 'all' || char.category === category;

      return matchesSearch && matchesCategory;
    });
  });

  // Category filter options
  categories = [
    { id: 'all', name: 'All Characters', icon: 'grid_view' },
    { id: 'checkmarks', name: 'Checkmarks', icon: 'check_circle' },
    { id: 'arrows', name: 'Arrow Characters', icon: 'arrow_forward' },
    { id: 'chess', name: 'Chess Symbols', icon: 'games' },
    { id: 'cards', name: 'Playing Card Suits', icon: 'style' },
    { id: 'mahjong', name: 'Mahjong Tiles', icon: 'games' },
    { id: 'dominos', name: 'Domino Tiles', icon: 'casino' },
    { id: 'music', name: 'Music Symbols', icon: 'music_note' },
    { id: 'gender', name: 'Gender Symbols', icon: 'wc' },
    { id: 'box-drawing', name: 'Bars', icon: 'reorder' },
    { id: 'miscellaneous', name: 'Miscellaneous', icon: 'category' },
    { id: 'printable', name: 'Printable Characters', icon: 'text_fields' },
    { id: 'symbol', name: 'Symbols', icon: 'code' },
    { id: 'number', name: 'Numbers', icon: 'pin' },
    { id: 'uppercase', name: 'Uppercase Letters', icon: 'title' },
    { id: 'lowercase', name: 'Lowercase Letters', icon: 'text_rotation_none' },
    { id: 'extended', name: 'Extended ASCII', icon: 'extension' }
  ];

  featuredTools$ = this.toolsService.getFeaturedTools();

  ngOnInit() {
    this.metaService.updateTags({
      title: 'ASCII Character Reference Table - Complete ASCII Code Chart',
      description: 'Complete ASCII character reference table with decimal, hex, binary codes. Search and copy ASCII characters, symbols, and control codes. Includes standard and extended ASCII table with HTML entities.',
      keywords: [
        'ascii art',
        'ascii table',
        'ascii code',
        'what is ascii',
        'ascii character',
        'ascii text',
        'ascii characters',
        'ascii symbol',
        'ascii chart',
        'ascii code table',
        'ascii reference',
        'character encoding',
        'ascii to text',
        'ascii converter',
        'html entities',
        'character codes',
        'ascii lookup'
      ],
      image: 'https://www.allthethings.dev/meta-images/og-ascii-character-reference.png',
      url: 'https://www.allthethings.dev/tools/ascii-character-reference',
      jsonLd: this.metaService.buildToolJsonLd({
        name: 'ASCII Character Reference Table',
        description: 'Complete ASCII character reference table with decimal, hex, binary codes. Search and copy ASCII characters, symbols, and control codes.',
        url: 'https://www.allthethings.dev/tools/ascii-character-reference',
        image: 'https://www.allthethings.dev/meta-images/og-ascii-character-reference.png'
      })
    });
  }

  setCategory(categoryId: string) {
    this.selectedCategory.set(categoryId);
  }

  copyCharacter(char: AsciiCharacter) {
    navigator.clipboard.writeText(char.char).then(() => {
      this.snackbar.show(
        `Copied "${char.char}" (${char.name}) to clipboard`,
        'success',
        3000
      );
    }).catch(() => {
      this.snackbar.show('Failed to copy character', 'error', 3000);
    });
  }

  copyCode(code: string, type: string) {
    navigator.clipboard.writeText(code).then(() => {
      this.snackbar.show(`Copied ${type} code: ${code}`, 'success', 3000);
    }).catch(() => {
      this.snackbar.show('Failed to copy code', 'error', 3000);
    });
  }

  copyArrow(arrow: { char: string; name: string; unicode: string }) {
    navigator.clipboard.writeText(arrow.char).then(() => {
      this.snackbar.show(
        `Copied "${arrow.char}" (${arrow.name}) to clipboard`,
        'success',
        3000
      );
    }).catch(() => {
      this.snackbar.show('Failed to copy arrow', 'error', 3000);
    });
  }

  clearSearch() {
    this.searchQuery.set('');
  }

  scrollToTable() {
    const element = document.querySelector('.ascii-grid-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  setViewMode(mode: 'grid' | 'compact') {
    this.viewMode.set(mode);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('asciiViewMode', mode);
    }
  }

  private getInitialViewMode(): 'grid' | 'compact' {
    if (isPlatformBrowser(this.platformId)) {
      const savedMode = localStorage.getItem('asciiViewMode');
      return (savedMode === 'compact' || savedMode === 'grid') ? savedMode : 'grid';
    }
    return 'grid';
  }

  private generateAsciiTable(): AsciiCharacter[] {
    const characters: AsciiCharacter[] = [];

    // Printable characters (32-126)
    const printableChars = [
      { dec: 32, char: ' ', name: 'SP', desc: 'Space', cat: 'printable' },
      { dec: 33, char: '!', name: 'Exclamation mark', desc: 'Exclamation mark', cat: 'symbol' },
      { dec: 34, char: '"', name: 'Double quotes', desc: 'Double quotes (or speech marks)', cat: 'symbol' },
      { dec: 35, char: '#', name: 'Number sign', desc: 'Number sign', cat: 'symbol' },
      { dec: 36, char: '$', name: 'Dollar', desc: 'Dollar', cat: 'symbol' },
      { dec: 37, char: '%', name: 'Per cent sign', desc: 'Per cent sign', cat: 'symbol' },
      { dec: 38, char: '&', name: 'Ampersand', desc: 'Ampersand', cat: 'symbol' },
      { dec: 39, char: "'", name: 'Single quote', desc: 'Single quote', cat: 'symbol' },
      { dec: 40, char: '(', name: 'Open parenthesis', desc: 'Open parenthesis (or open bracket)', cat: 'symbol' },
      { dec: 41, char: ')', name: 'Close parenthesis', desc: 'Close parenthesis (or close bracket)', cat: 'symbol' },
      { dec: 42, char: '*', name: 'Asterisk', desc: 'Asterisk', cat: 'symbol' },
      { dec: 43, char: '+', name: 'Plus', desc: 'Plus', cat: 'symbol' },
      { dec: 44, char: ',', name: 'Comma', desc: 'Comma', cat: 'symbol' },
      { dec: 45, char: '-', name: 'Hyphen-minus', desc: 'Hyphen-minus', cat: 'symbol' },
      { dec: 46, char: '.', name: 'Period', desc: 'Period, dot or full stop', cat: 'symbol' },
      { dec: 47, char: '/', name: 'Slash', desc: 'Slash or divide', cat: 'symbol' },
      { dec: 48, char: '0', name: 'Zero', desc: 'Zero', cat: 'number' },
      { dec: 49, char: '1', name: 'One', desc: 'One', cat: 'number' },
      { dec: 50, char: '2', name: 'Two', desc: 'Two', cat: 'number' },
      { dec: 51, char: '3', name: 'Three', desc: 'Three', cat: 'number' },
      { dec: 52, char: '4', name: 'Four', desc: 'Four', cat: 'number' },
      { dec: 53, char: '5', name: 'Five', desc: 'Five', cat: 'number' },
      { dec: 54, char: '6', name: 'Six', desc: 'Six', cat: 'number' },
      { dec: 55, char: '7', name: 'Seven', desc: 'Seven', cat: 'number' },
      { dec: 56, char: '8', name: 'Eight', desc: 'Eight', cat: 'number' },
      { dec: 57, char: '9', name: 'Nine', desc: 'Nine', cat: 'number' },
      { dec: 58, char: ':', name: 'Colon', desc: 'Colon', cat: 'symbol' },
      { dec: 59, char: ';', name: 'Semicolon', desc: 'Semicolon', cat: 'symbol' },
      { dec: 60, char: '<', name: 'Less than', desc: 'Less than (or open angled bracket)', cat: 'symbol' },
      { dec: 61, char: '=', name: 'Equals', desc: 'Equals', cat: 'symbol' },
      { dec: 62, char: '>', name: 'Greater than', desc: 'Greater than (or close angled bracket)', cat: 'symbol' },
      { dec: 63, char: '?', name: 'Question mark', desc: 'Question mark', cat: 'symbol' },
      { dec: 64, char: '@', name: 'At sign', desc: 'At sign', cat: 'symbol' },
      { dec: 65, char: 'A', name: 'Uppercase A', desc: 'Uppercase A', cat: 'uppercase' },
      { dec: 66, char: 'B', name: 'Uppercase B', desc: 'Uppercase B', cat: 'uppercase' },
      { dec: 67, char: 'C', name: 'Uppercase C', desc: 'Uppercase C', cat: 'uppercase' },
      { dec: 68, char: 'D', name: 'Uppercase D', desc: 'Uppercase D', cat: 'uppercase' },
      { dec: 69, char: 'E', name: 'Uppercase E', desc: 'Uppercase E', cat: 'uppercase' },
      { dec: 70, char: 'F', name: 'Uppercase F', desc: 'Uppercase F', cat: 'uppercase' },
      { dec: 71, char: 'G', name: 'Uppercase G', desc: 'Uppercase G', cat: 'uppercase' },
      { dec: 72, char: 'H', name: 'Uppercase H', desc: 'Uppercase H', cat: 'uppercase' },
      { dec: 73, char: 'I', name: 'Uppercase I', desc: 'Uppercase I', cat: 'uppercase' },
      { dec: 74, char: 'J', name: 'Uppercase J', desc: 'Uppercase J', cat: 'uppercase' },
      { dec: 75, char: 'K', name: 'Uppercase K', desc: 'Uppercase K', cat: 'uppercase' },
      { dec: 76, char: 'L', name: 'Uppercase L', desc: 'Uppercase L', cat: 'uppercase' },
      { dec: 77, char: 'M', name: 'Uppercase M', desc: 'Uppercase M', cat: 'uppercase' },
      { dec: 78, char: 'N', name: 'Uppercase N', desc: 'Uppercase N', cat: 'uppercase' },
      { dec: 79, char: 'O', name: 'Uppercase O', desc: 'Uppercase O', cat: 'uppercase' },
      { dec: 80, char: 'P', name: 'Uppercase P', desc: 'Uppercase P', cat: 'uppercase' },
      { dec: 81, char: 'Q', name: 'Uppercase Q', desc: 'Uppercase Q', cat: 'uppercase' },
      { dec: 82, char: 'R', name: 'Uppercase R', desc: 'Uppercase R', cat: 'uppercase' },
      { dec: 83, char: 'S', name: 'Uppercase S', desc: 'Uppercase S', cat: 'uppercase' },
      { dec: 84, char: 'T', name: 'Uppercase T', desc: 'Uppercase T', cat: 'uppercase' },
      { dec: 85, char: 'U', name: 'Uppercase U', desc: 'Uppercase U', cat: 'uppercase' },
      { dec: 86, char: 'V', name: 'Uppercase V', desc: 'Uppercase V', cat: 'uppercase' },
      { dec: 87, char: 'W', name: 'Uppercase W', desc: 'Uppercase W', cat: 'uppercase' },
      { dec: 88, char: 'X', name: 'Uppercase X', desc: 'Uppercase X', cat: 'uppercase' },
      { dec: 89, char: 'Y', name: 'Uppercase Y', desc: 'Uppercase Y', cat: 'uppercase' },
      { dec: 90, char: 'Z', name: 'Uppercase Z', desc: 'Uppercase Z', cat: 'uppercase' },
      { dec: 91, char: '[', name: 'Opening bracket', desc: 'Opening bracket', cat: 'symbol' },
      { dec: 92, char: '\\', name: 'Backslash', desc: 'Backslash', cat: 'symbol' },
      { dec: 93, char: ']', name: 'Closing bracket', desc: 'Closing bracket', cat: 'symbol' },
      { dec: 94, char: '^', name: 'Caret', desc: 'Caret - circumflex', cat: 'symbol' },
      { dec: 95, char: '_', name: 'Underscore', desc: 'Underscore', cat: 'symbol' },
      { dec: 96, char: '`', name: 'Grave accent', desc: 'Grave accent', cat: 'symbol' },
      { dec: 97, char: 'a', name: 'Lowercase a', desc: 'Lowercase a', cat: 'lowercase' },
      { dec: 98, char: 'b', name: 'Lowercase b', desc: 'Lowercase b', cat: 'lowercase' },
      { dec: 99, char: 'c', name: 'Lowercase c', desc: 'Lowercase c', cat: 'lowercase' },
      { dec: 100, char: 'd', name: 'Lowercase d', desc: 'Lowercase d', cat: 'lowercase' },
      { dec: 101, char: 'e', name: 'Lowercase e', desc: 'Lowercase e', cat: 'lowercase' },
      { dec: 102, char: 'f', name: 'Lowercase f', desc: 'Lowercase f', cat: 'lowercase' },
      { dec: 103, char: 'g', name: 'Lowercase g', desc: 'Lowercase g', cat: 'lowercase' },
      { dec: 104, char: 'h', name: 'Lowercase h', desc: 'Lowercase h', cat: 'lowercase' },
      { dec: 105, char: 'i', name: 'Lowercase i', desc: 'Lowercase i', cat: 'lowercase' },
      { dec: 106, char: 'j', name: 'Lowercase j', desc: 'Lowercase j', cat: 'lowercase' },
      { dec: 107, char: 'k', name: 'Lowercase k', desc: 'Lowercase k', cat: 'lowercase' },
      { dec: 108, char: 'l', name: 'Lowercase l', desc: 'Lowercase l', cat: 'lowercase' },
      { dec: 109, char: 'm', name: 'Lowercase m', desc: 'Lowercase m', cat: 'lowercase' },
      { dec: 110, char: 'n', name: 'Lowercase n', desc: 'Lowercase n', cat: 'lowercase' },
      { dec: 111, char: 'o', name: 'Lowercase o', desc: 'Lowercase o', cat: 'lowercase' },
      { dec: 112, char: 'p', name: 'Lowercase p', desc: 'Lowercase p', cat: 'lowercase' },
      { dec: 113, char: 'q', name: 'Lowercase q', desc: 'Lowercase q', cat: 'lowercase' },
      { dec: 114, char: 'r', name: 'Lowercase r', desc: 'Lowercase r', cat: 'lowercase' },
      { dec: 115, char: 's', name: 'Lowercase s', desc: 'Lowercase s', cat: 'lowercase' },
      { dec: 116, char: 't', name: 'Lowercase t', desc: 'Lowercase t', cat: 'lowercase' },
      { dec: 117, char: 'u', name: 'Lowercase u', desc: 'Lowercase u', cat: 'lowercase' },
      { dec: 118, char: 'v', name: 'Lowercase v', desc: 'Lowercase v', cat: 'lowercase' },
      { dec: 119, char: 'w', name: 'Lowercase w', desc: 'Lowercase w', cat: 'lowercase' },
      { dec: 120, char: 'x', name: 'Lowercase x', desc: 'Lowercase x', cat: 'lowercase' },
      { dec: 121, char: 'y', name: 'Lowercase y', desc: 'Lowercase y', cat: 'lowercase' },
      { dec: 122, char: 'z', name: 'Lowercase z', desc: 'Lowercase z', cat: 'lowercase' },
      { dec: 123, char: '{', name: 'Opening brace', desc: 'Opening brace', cat: 'symbol' },
      { dec: 124, char: '|', name: 'Vertical bar', desc: 'Vertical bar', cat: 'symbol' },
      { dec: 125, char: '}', name: 'Closing brace', desc: 'Closing brace', cat: 'symbol' },
      { dec: 126, char: '~', name: 'Tilde', desc: 'Equivalency sign - tilde', cat: 'symbol' }
    ];

    printableChars.forEach(p => {
      characters.push({
        decimal: p.dec,
        hex: p.dec.toString(16).toUpperCase().padStart(2, '0'),
        binary: p.dec.toString(2).padStart(8, '0'),
        char: p.char,
        name: p.name,
        category: p.cat as AsciiCharacter['category'],
        description: p.desc,
        htmlEntity: `&#${p.dec};`
      });
    });

    // Extended ASCII (128-255)
    const extendedChars = [
      { dec: 128, char: '€', name: 'Euro sign', desc: 'Euro sign' },
      { dec: 130, char: '‚', name: 'Single low-9 quotation mark', desc: 'Single low-9 quotation mark' },
      { dec: 131, char: 'ƒ', name: 'Latin small letter f with hook', desc: 'Latin small letter f with hook' },
      { dec: 132, char: '„', name: 'Double low-9 quotation mark', desc: 'Double low-9 quotation mark' },
      { dec: 133, char: '…', name: 'Horizontal ellipsis', desc: 'Horizontal ellipsis' },
      { dec: 134, char: '†', name: 'Dagger', desc: 'Dagger' },
      { dec: 135, char: '‡', name: 'Double dagger', desc: 'Double dagger' },
      { dec: 136, char: 'ˆ', name: 'Modifier letter circumflex accent', desc: 'Modifier letter circumflex accent' },
      { dec: 137, char: '‰', name: 'Per mille sign', desc: 'Per mille sign' },
      { dec: 138, char: 'Š', name: 'Latin capital letter S with caron', desc: 'Latin capital letter S with caron' },
      { dec: 139, char: '‹', name: 'Single left-pointing angle quotation', desc: 'Single left-pointing angle quotation' },
      { dec: 140, char: 'Œ', name: 'Latin capital ligature OE', desc: 'Latin capital ligature OE' },
      { dec: 142, char: 'Ž', name: 'Latin capital letter Z with caron', desc: 'Latin capital letter Z with caron' },
      { dec: 145, char: "\u2018", name: 'Left single quotation mark', desc: 'Left single quotation mark' },
      { dec: 146, char: "\u2019", name: 'Right single quotation mark', desc: 'Right single quotation mark' },
      { dec: 147, char: "\u201C", name: 'Left double quotation mark', desc: 'Left double quotation mark' },
      { dec: 148, char: "\u201D", name: 'Right double quotation mark', desc: 'Right double quotation mark' },
      { dec: 149, char: '•', name: 'Bullet', desc: 'Bullet' },
      { dec: 150, char: '–', name: 'En dash', desc: 'En dash' },
      { dec: 151, char: '—', name: 'Em dash', desc: 'Em dash' },
      { dec: 152, char: '˜', name: 'Small tilde', desc: 'Small tilde' },
      { dec: 153, char: '™', name: 'Trade mark sign', desc: 'Trade mark sign' },
      { dec: 154, char: 'š', name: 'Latin small letter S with caron', desc: 'Latin small letter S with caron' },
      { dec: 155, char: '›', name: 'Single right-pointing angle quotation mark', desc: 'Single right-pointing angle quotation mark' },
      { dec: 156, char: 'œ', name: 'Latin small ligature oe', desc: 'Latin small ligature oe' },
      { dec: 158, char: 'ž', name: 'Latin small letter z with caron', desc: 'Latin small letter z with caron' },
      { dec: 159, char: 'Ÿ', name: 'Latin capital letter Y with diaeresis', desc: 'Latin capital letter Y with diaeresis' },
      { dec: 160, char: ' ', name: 'NBSP', desc: 'Non-breaking space' },
      { dec: 161, char: '¡', name: 'Inverted exclamation mark', desc: 'Inverted exclamation mark' },
      { dec: 162, char: '¢', name: 'Cent sign', desc: 'Cent sign' },
      { dec: 163, char: '£', name: 'Pound sign', desc: 'Pound sign' },
      { dec: 164, char: '¤', name: 'Currency sign', desc: 'Currency sign' },
      { dec: 165, char: '¥', name: 'Yen sign', desc: 'Yen sign' },
      { dec: 166, char: '¦', name: 'Pipe, broken vertical bar', desc: 'Pipe, broken vertical bar' },
      { dec: 167, char: '§', name: 'Section sign', desc: 'Section sign' },
      { dec: 168, char: '¨', name: 'Spacing diaeresis - umlaut', desc: 'Spacing diaeresis - umlaut' },
      { dec: 169, char: '©', name: 'Copyright sign', desc: 'Copyright sign' },
      { dec: 170, char: 'ª', name: 'Feminine ordinal indicator', desc: 'Feminine ordinal indicator' },
      { dec: 171, char: '«', name: 'Left double angle quotes', desc: 'Left double angle quotes' },
      { dec: 172, char: '¬', name: 'Negation', desc: 'Negation' },
      { dec: 173, char: '­', name: 'SHY', desc: 'Soft hyphen' },
      { dec: 174, char: '®', name: 'Registered trade mark sign', desc: 'Registered trade mark sign' },
      { dec: 175, char: '¯', name: 'Spacing macron - overline', desc: 'Spacing macron - overline' },
      { dec: 176, char: '°', name: 'Degree sign', desc: 'Degree sign' },
      { dec: 177, char: '±', name: 'Plus-or-minus sign', desc: 'Plus-or-minus sign' },
      { dec: 178, char: '²', name: 'Superscript two - squared', desc: 'Superscript two - squared' },
      { dec: 179, char: '³', name: 'Superscript three - cubed', desc: 'Superscript three - cubed' },
      { dec: 180, char: '´', name: 'Acute accent - spacing acute', desc: 'Acute accent - spacing acute' },
      { dec: 181, char: 'µ', name: 'Micro sign', desc: 'Micro sign' },
      { dec: 182, char: '¶', name: 'Pilcrow sign - paragraph sign', desc: 'Pilcrow sign - paragraph sign' },
      { dec: 183, char: '·', name: 'Middle dot - Georgian comma', desc: 'Middle dot - Georgian comma' },
      { dec: 184, char: '¸', name: 'Spacing cedilla', desc: 'Spacing cedilla' },
      { dec: 185, char: '¹', name: 'Superscript one', desc: 'Superscript one' },
      { dec: 186, char: 'º', name: 'Masculine ordinal indicator', desc: 'Masculine ordinal indicator' },
      { dec: 187, char: '»', name: 'Right double angle quotes', desc: 'Right double angle quotes' },
      { dec: 188, char: '¼', name: 'Fraction one quarter', desc: 'Fraction one quarter' },
      { dec: 189, char: '½', name: 'Fraction one half', desc: 'Fraction one half' },
      { dec: 190, char: '¾', name: 'Fraction three quarters', desc: 'Fraction three quarters' },
      { dec: 191, char: '¿', name: 'Inverted question mark', desc: 'Inverted question mark' },
      { dec: 192, char: 'À', name: 'Latin capital letter A with grave', desc: 'Latin capital letter A with grave' },
      { dec: 193, char: 'Á', name: 'Latin capital letter A with acute', desc: 'Latin capital letter A with acute' },
      { dec: 194, char: 'Â', name: 'Latin capital letter A with circumflex', desc: 'Latin capital letter A with circumflex' },
      { dec: 195, char: 'Ã', name: 'Latin capital letter A with tilde', desc: 'Latin capital letter A with tilde' },
      { dec: 196, char: 'Ä', name: 'Latin capital letter A with diaeresis', desc: 'Latin capital letter A with diaeresis' },
      { dec: 197, char: 'Å', name: 'Latin capital letter A with ring above', desc: 'Latin capital letter A with ring above' },
      { dec: 198, char: 'Æ', name: 'Latin capital letter AE', desc: 'Latin capital letter AE' },
      { dec: 199, char: 'Ç', name: 'Latin capital letter C with cedilla', desc: 'Latin capital letter C with cedilla' },
      { dec: 200, char: 'È', name: 'Latin capital letter E with grave', desc: 'Latin capital letter E with grave' },
      { dec: 201, char: 'É', name: 'Latin capital letter E with acute', desc: 'Latin capital letter E with acute' },
      { dec: 202, char: 'Ê', name: 'Latin capital letter E with circumflex', desc: 'Latin capital letter E with circumflex' },
      { dec: 203, char: 'Ë', name: 'Latin capital letter E with diaeresis', desc: 'Latin capital letter E with diaeresis' },
      { dec: 204, char: 'Ì', name: 'Latin capital letter I with grave', desc: 'Latin capital letter I with grave' },
      { dec: 205, char: 'Í', name: 'Latin capital letter I with acute', desc: 'Latin capital letter I with acute' },
      { dec: 206, char: 'Î', name: 'Latin capital letter I with circumflex', desc: 'Latin capital letter I with circumflex' },
      { dec: 207, char: 'Ï', name: 'Latin capital letter I with diaeresis', desc: 'Latin capital letter I with diaeresis' },
      { dec: 208, char: 'Ð', name: 'Latin capital letter ETH', desc: 'Latin capital letter ETH' },
      { dec: 209, char: 'Ñ', name: 'Latin capital letter N with tilde', desc: 'Latin capital letter N with tilde' },
      { dec: 210, char: 'Ò', name: 'Latin capital letter O with grave', desc: 'Latin capital letter O with grave' },
      { dec: 211, char: 'Ó', name: 'Latin capital letter O with acute', desc: 'Latin capital letter O with acute' },
      { dec: 212, char: 'Ô', name: 'Latin capital letter O with circumflex', desc: 'Latin capital letter O with circumflex' },
      { dec: 213, char: 'Õ', name: 'Latin capital letter O with tilde', desc: 'Latin capital letter O with tilde' },
      { dec: 214, char: 'Ö', name: 'Latin capital letter O with diaeresis', desc: 'Latin capital letter O with diaeresis' },
      { dec: 215, char: '×', name: 'Multiplication sign', desc: 'Multiplication sign' },
      { dec: 216, char: 'Ø', name: 'Latin capital letter O with slash', desc: 'Latin capital letter O with slash' },
      { dec: 217, char: 'Ù', name: 'Latin capital letter U with grave', desc: 'Latin capital letter U with grave' },
      { dec: 218, char: 'Ú', name: 'Latin capital letter U with acute', desc: 'Latin capital letter U with acute' },
      { dec: 219, char: 'Û', name: 'Latin capital letter U with circumflex', desc: 'Latin capital letter U with circumflex' },
      { dec: 220, char: 'Ü', name: 'Latin capital letter U with diaeresis', desc: 'Latin capital letter U with diaeresis' },
      { dec: 221, char: 'Ý', name: 'Latin capital letter Y with acute', desc: 'Latin capital letter Y with acute' },
      { dec: 222, char: 'Þ', name: 'Latin capital letter THORN', desc: 'Latin capital letter THORN' },
      { dec: 223, char: 'ß', name: 'Latin small letter sharp s - ess-zed', desc: 'Latin small letter sharp s - ess-zed' },
      { dec: 224, char: 'à', name: 'Latin small letter a with grave', desc: 'Latin small letter a with grave' },
      { dec: 225, char: 'á', name: 'Latin small letter a with acute', desc: 'Latin small letter a with acute' },
      { dec: 226, char: 'â', name: 'Latin small letter a with circumflex', desc: 'Latin small letter a with circumflex' },
      { dec: 227, char: 'ã', name: 'Latin small letter a with tilde', desc: 'Latin small letter a with tilde' },
      { dec: 228, char: 'ä', name: 'Latin small letter a with diaeresis', desc: 'Latin small letter a with diaeresis' },
      { dec: 229, char: 'å', name: 'Latin small letter a with ring above', desc: 'Latin small letter a with ring above' },
      { dec: 230, char: 'æ', name: 'Latin small letter ae', desc: 'Latin small letter ae' },
      { dec: 231, char: 'ç', name: 'Latin small letter c with cedilla', desc: 'Latin small letter c with cedilla' },
      { dec: 232, char: 'è', name: 'Latin small letter e with grave', desc: 'Latin small letter e with grave' },
      { dec: 233, char: 'é', name: 'Latin small letter e with acute', desc: 'Latin small letter e with acute' },
      { dec: 234, char: 'ê', name: 'Latin small letter e with circumflex', desc: 'Latin small letter e with circumflex' },
      { dec: 235, char: 'ë', name: 'Latin small letter e with diaeresis', desc: 'Latin small letter e with diaeresis' },
      { dec: 236, char: 'ì', name: 'Latin small letter i with grave', desc: 'Latin small letter i with grave' },
      { dec: 237, char: 'í', name: 'Latin small letter i with acute', desc: 'Latin small letter i with acute' },
      { dec: 238, char: 'î', name: 'Latin small letter i with circumflex', desc: 'Latin small letter i with circumflex' },
      { dec: 239, char: 'ï', name: 'Latin small letter i with diaeresis', desc: 'Latin small letter i with diaeresis' },
      { dec: 240, char: 'ð', name: 'Latin small letter eth', desc: 'Latin small letter eth' },
      { dec: 241, char: 'ñ', name: 'Latin small letter n with tilde', desc: 'Latin small letter n with tilde' },
      { dec: 242, char: 'ò', name: 'Latin small letter o with grave', desc: 'Latin small letter o with grave' },
      { dec: 243, char: 'ó', name: 'Latin small letter o with acute', desc: 'Latin small letter o with acute' },
      { dec: 244, char: 'ô', name: 'Latin small letter o with circumflex', desc: 'Latin small letter o with circumflex' },
      { dec: 245, char: 'õ', name: 'Latin small letter o with tilde', desc: 'Latin small letter o with tilde' },
      { dec: 246, char: 'ö', name: 'Latin small letter o with diaeresis', desc: 'Latin small letter o with diaeresis' },
      { dec: 247, char: '÷', name: 'Division sign', desc: 'Division sign' },
      { dec: 248, char: 'ø', name: 'Latin small letter o with slash', desc: 'Latin small letter o with slash' },
      { dec: 249, char: 'ù', name: 'Latin small letter u with grave', desc: 'Latin small letter u with grave' },
      { dec: 250, char: 'ú', name: 'Latin small letter u with acute', desc: 'Latin small letter u with acute' },
      { dec: 251, char: 'û', name: 'Latin small letter u with circumflex', desc: 'Latin small letter u with circumflex' },
      { dec: 252, char: 'ü', name: 'Latin small letter u with diaeresis', desc: 'Latin small letter u with diaeresis' },
      { dec: 253, char: 'ý', name: 'Latin small letter y with acute', desc: 'Latin small letter y with acute' },
      { dec: 254, char: 'þ', name: 'Latin small letter thorn', desc: 'Latin small letter thorn' },
      { dec: 255, char: 'ÿ', name: 'Latin small letter y with diaeresis', desc: 'Latin small letter y with diaeresis' }
    ];

    extendedChars.forEach(e => {
      characters.push({
        decimal: e.dec,
        hex: e.dec.toString(16).toUpperCase().padStart(2, '0'),
        binary: e.dec.toString(2).padStart(8, '0'),
        char: e.char || e.name,
        name: e.name,
        category: 'extended',
        description: e.desc,
        htmlEntity: `&#${e.dec};`
      });
    });

    return characters;
  }

}
