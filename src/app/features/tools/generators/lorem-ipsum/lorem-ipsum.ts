import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';
import { MetaService } from '../../../../core/services/meta.service';
import { ToolsService } from '../../../../core/services/tools.service';
import { Tool, ToolCategoryMeta } from '../../../../core/models/tool.interface';

type LoremType = 'nonsensical' | 'cicero-latin' | 'cicero-english';

@Component({
  selector: 'app-lorem-ipsum',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatRadioModule,
    MatSliderModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    PageHeaderComponent
  ],
  templateUrl: './lorem-ipsum.html',
  styleUrl: './lorem-ipsum.scss',
})
export class LoremIpsum implements OnInit {
  toolsService = inject(ToolsService);
  private metaService = inject(MetaService);
  private snackBar = inject(MatSnackBar);

  featuredTools: Tool[] = [];
  categories: ToolCategoryMeta[] = [];

  ngOnInit(): void {
    this.metaService.updateTags({
      title: 'Lorem Ipsum Generator',
      description: 'Generate Lorem Ipsum placeholder text with customizable word count. Choose from non-sensical, Cicero Latin, or Cicero English variations.',
      keywords: ['lorem ipsum', 'placeholder text', 'text generator', 'cicero', 'dummy text'],
      image: 'https://www.allthethings.dev/meta-images/og-lorem-ipsum.png',
      url: 'https://www.allthethings.dev/tools/lorem-ipsum'
    });

    this.featuredTools = this.toolsService.getFeaturedTools();
    this.categories = this.toolsService.getAllCategories();
  }

  // Base text passages
  private readonly baseTexts = {
    nonsensical: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,

    'cicero-latin': `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?`,

    'cicero-english': `But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?`
  };

  // Signals
  selectedType = signal<LoremType>('nonsensical');
  wordCount = signal<number>(69); // Default to the word count of nonsensical

  // Computed signal for generated text
  generatedText = computed(() => {
    const type = this.selectedType();
    const count = this.wordCount();
    return this.generateText(type, count);
  });

  /**
   * Generate text based on type and word count
   */
  private generateText(type: LoremType, wordCount: number): string {
    const baseText = this.baseTexts[type];
    const words = baseText.split(/\s+/);

    if (wordCount <= words.length) {
      // Return subset of words
      return words.slice(0, wordCount).join(' ');
    }

    // Need to repeat text in paragraphs
    const paragraphs: string[] = [];
    let remainingWords = wordCount;

    while (remainingWords > 0) {
      if (remainingWords >= words.length) {
        paragraphs.push(baseText);
        remainingWords -= words.length;
      } else {
        paragraphs.push(words.slice(0, remainingWords).join(' '));
        remainingWords = 0;
      }
    }

    return paragraphs.join('\n\n');
  }

  /**
   * Update selected type
   */
  updateType(type: LoremType): void {
    this.selectedType.set(type);
  }

  /**
   * Update word count
   */
  updateWordCount(count: number): void {
    this.wordCount.set(count);
  }

  /**
   * Copy text to clipboard
   */
  async copyToClipboard(): Promise<void> {
    const text = this.generatedText();
    if (!text) {
      this.snackBar.open('No text to copy', 'Close', {
        duration: 2000
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      this.snackBar.open('Copied to clipboard!', 'Close', {
        duration: 2000
      });
    } catch (err) {
      this.snackBar.open('Failed to copy to clipboard', 'Close', {
        duration: 2000
      });
    }
  }

  /**
   * Format number for display
   */
  formatLabel(value: number): string {
    return `${value}`;
  }

  scrollToGenerator(): void {
    const element = document.querySelector('.cta-button');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}