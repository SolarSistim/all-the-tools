import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { ToolsService } from '../../../../core/services/tools.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';
import { MetaService } from '../../../../core/services/meta.service';
import { CustomSnackbarService } from '../../../../core/services/custom-snackbar.service';
import { Tool, ToolCategoryMeta } from '../../../../core/models/tool.interface';
import { ToolCardComponent } from '../../../../shared/components/tool-card/tool-card';
import { CtaEmailList } from '../../../reusable-components/cta-email-list/cta-email-list';
import { AdsenseComponent } from '../../../blog/components/adsense/adsense.component';

interface TextMetrics {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  spaces: number;
  lines: number;
  averageWordLength: number;
  readingTime: number; // in minutes
  speakingTime: number; // in minutes
}

@Component({
  selector: 'app-word-counter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    PageHeaderComponent,
    ToolCardComponent,
    CtaEmailList,
    AdsenseComponent
  ],
  templateUrl: './word-counter.html',
  styleUrl: './word-counter.scss'
})
export class WordCounter implements OnInit {

  toolsService = inject(ToolsService);
  private metaService = inject(MetaService);
  private snackbar = inject(CustomSnackbarService);

  featuredTools: Tool[] = [];
  categories: ToolCategoryMeta[] = [];

  ngOnInit(): void {
    this.metaService.updateTags({
      title: 'Word & Character Counter',
      description: 'Count words, characters, sentences, paragraphs, and estimates reading time.',
      keywords: ['word counter', 'character counter', 'text analysis', 'word count', 'writing tool'],
      image: 'https://www.allthethings.dev/meta-images/og-word-counter.png',
      url: 'https://www.allthethings.dev/tools/word-counter'
    });

    this.featuredTools = this.toolsService.getFeaturedTools();
    this.categories = this.toolsService.getAllCategories();
  }

  // Input text
  inputText = signal<string>('');

  // Metrics
  metrics = signal<TextMetrics>({
    words: 0,
    characters: 0,
    charactersNoSpaces: 0,
    sentences: 0,
    paragraphs: 0,
    spaces: 0,
    lines: 0,
    averageWordLength: 0,
    readingTime: 0,
    speakingTime: 0
  });

  /**
   * Analyze text and calculate all metrics
   */
  analyzeText(): void {
    const text = this.inputText();

    if (!text || text.trim().length === 0) {
      this.metrics.set({
        words: 0,
        characters: 0,
        charactersNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        spaces: 0,
        lines: 0,
        averageWordLength: 0,
        readingTime: 0,
        speakingTime: 0
      });
      return;
    }

    // Count words (split by whitespace, filter out empty strings)
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    // Count characters
    const characterCount = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;

    // Count sentences (split by . ! ?)
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    const sentenceCount = sentences.length;

    // Count paragraphs (split by double newline or more)
    const paragraphs = text.split(/\n\s*\n/).filter(para => para.trim().length > 0);
    const paragraphCount = paragraphs.length;

    // Count spaces
    const spaceCount = (text.match(/\s/g) || []).length;

    // Count lines
    const lineCount = text.split('\n').length;

    // Calculate average word length
    const totalWordLength = words.reduce((sum, word) => sum + word.length, 0);
    const averageWordLength = wordCount > 0 ? totalWordLength / wordCount : 0;

    // Calculate reading time (average reading speed: 200-250 words per minute)
    const readingTime = wordCount / 225;

    // Calculate speaking time (average speaking speed: 130-150 words per minute)
    const speakingTime = wordCount / 140;

    this.metrics.set({
      words: wordCount,
      characters: characterCount,
      charactersNoSpaces: charactersNoSpaces,
      sentences: sentenceCount,
      paragraphs: paragraphCount,
      spaces: spaceCount,
      lines: lineCount,
      averageWordLength: averageWordLength,
      readingTime: readingTime,
      speakingTime: speakingTime
    });
  }

  /**
   * Clear all text and metrics
   */
  clearText(): void {
    this.inputText.set('');
    this.analyzeText();
    this.snackbar.success('Text cleared', 2000);
  }

  /**
   * Format time in minutes and seconds
   */
  formatTime(minutes: number): string {
    if (minutes === 0) return '0s';

    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);

    if (mins === 0) {
      return `${secs}s`;
    } else if (secs === 0) {
      return `${mins}m`;
    } else {
      return `${mins}m ${secs}s`;
    }
  }

  scrollToTextArea(): void {
    const element = document.querySelector('.hero-cta');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}