import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSliderModule } from '@angular/material/slider';
import { MorseCodeService } from '../services/morse-code.service';
import { MorseAudioService } from '../services/morse-audio.service';
import { MorseStorageService, SavedMorseConversion } from '../services/morse-storage.service';
import { MetaService } from '../../../../core/services/meta.service';
import { CustomSnackbarService } from '../../../../core/services/custom-snackbar.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';
import { CtaEmailList } from '../../../reusable-components/cta-email-list/cta-email-list';
import { AdsenseComponent } from '../../../blog/components/adsense/adsense.component';

@Component({
  selector: 'app-morse-code-converter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatTooltipModule,
    MatSliderModule,
    PageHeaderComponent,
    CtaEmailList,
    AdsenseComponent
  ],
  templateUrl: './morse-code-converter.component.html',
  styleUrl: './morse-code-converter.component.scss',
})
export class MorseCodeConverterComponent implements OnInit, OnDestroy {
  private metaService = inject(MetaService);
  private snackbar = inject(CustomSnackbarService);
  private morseService = inject(MorseCodeService);
  private audioService = inject(MorseAudioService);
  private storageService = inject(MorseStorageService);

  textInput = signal<string>('');
  morseOutput = signal<string>('');
  visualOutput = signal<string>('');
  timingBar = signal<string>('');
  unsupportedChars = signal<string[]>([]);
  warningMessage = signal<string>('');

  wpm = signal<number>(15);
  frequency = signal<number>(600);
  volume = signal<number>(0.5);
  isPlaying = signal<boolean>(false);
  currentlyPlayingMorse = signal<string | null>(null);

  savedConversions = signal<SavedMorseConversion[]>([]);
  displayedColumns: string[] = ['text', 'morse', 'timestamp', 'actions'];

  ngOnInit(): void {
    this.updateMetaTags();
    this.loadSavedConversions();
  }

  ngOnDestroy(): void {
    this.audioService.destroy();
  }

  private updateMetaTags(): void {
    this.metaService.updateTags({
      title: 'Morse Code Converter - Text to Morse Code Translator',
      description: 'Free online Morse code converter. Convert text to Morse code with real-time translation, audio playback, and visual representation. Save conversions and export to text files.',
      keywords: ['morse code', 'morse converter', 'morse translator', 'text to morse', 'morse audio', 'morse code generator'],
      image: 'https://www.allthethings.dev/meta-images/og-morse-code-converter-and-downloader.png',
      url: 'https://www.allthethings.dev/tools/morse-code-converter'
    });
  }

  private loadSavedConversions(): void {
    const conversions = this.storageService.loadConversions();
    this.savedConversions.set(conversions);
  }

  onTextInput(): void {
    const input = this.textInput().trim();
    this.warningMessage.set('');
    this.unsupportedChars.set([]);

    if (!input) {
      this.morseOutput.set('');
      this.visualOutput.set('');
      this.timingBar.set('');
      return;
    }

    const result = this.morseService.textToMorse(input);

    this.morseOutput.set(result.morse);
    this.visualOutput.set(result.visual);
    this.timingBar.set(this.morseService.morseToTimingBar(result.morse));

    if (result.unsupportedChars.length > 0) {
      this.unsupportedChars.set(result.unsupportedChars);
      this.warningMessage.set(
        `Unsupported characters: ${result.unsupportedChars.join(', ')}. These characters were skipped.`
      );
    }
  }

  playMorse(): void {
    const morse = this.morseOutput();
    if (!morse) {
      this.snackbar.warning('Enter some text to convert first', 2000);
      return;
    }

    this.audioService.stop();
    this.isPlaying.set(true);
    this.currentlyPlayingMorse.set(null);

    this.audioService.playMorse(morse, {
      wpm: this.wpm(),
      frequency: this.frequency(),
      volume: this.volume()
    });

    setTimeout(() => {
      this.isPlaying.set(false);
      this.currentlyPlayingMorse.set(null);
    }, this.estimatePlaybackDuration(morse));
  }

  stopMorse(): void {
    this.audioService.stop();
    this.isPlaying.set(false);
    this.currentlyPlayingMorse.set(null);
  }

  playSavedMorse(morse: string): void {
    if (this.currentlyPlayingMorse() === morse) {
      this.stopMorse();
      return;
    }

    this.audioService.stop();
    this.currentlyPlayingMorse.set(morse);
    this.isPlaying.set(true);

    this.audioService.playMorse(morse, {
      wpm: this.wpm(),
      frequency: this.frequency(),
      volume: this.volume()
    });

    setTimeout(() => {
      this.isPlaying.set(false);
      this.currentlyPlayingMorse.set(null);
    }, this.estimatePlaybackDuration(morse));
  }

  isPlayingSaved(morse: string): boolean {
    return this.currentlyPlayingMorse() === morse;
  }

  async downloadCurrentMorse(): Promise<void> {
    const morse = this.morseOutput();
    const text = this.textInput().trim();

    if (!morse) {
      this.snackbar.warning('Enter some text to convert first', 2000);
      return;
    }

    try {
      const sanitizedText = text ? text.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50) : 'morse';
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `morse_${sanitizedText}_${timestamp}.wav`;

      await this.audioService.downloadMorseAsWav(morse, {
        wpm: this.wpm(),
        frequency: this.frequency(),
        volume: this.volume()
      }, filename);

      this.snackbar.success('Audio file downloaded!', 2000);
    } catch (error) {
      console.error('Error downloading audio:', error);
      this.snackbar.error('Failed to download audio', 2000);
    }
  }

  async downloadSavedMorse(text: string, morse: string): Promise<void> {
    try {
      const sanitizedText = text.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `morse_${sanitizedText}_${timestamp}.wav`;

      await this.audioService.downloadMorseAsWav(morse, {
        wpm: this.wpm(),
        frequency: this.frequency(),
        volume: this.volume()
      }, filename);

      this.snackbar.success('Audio file downloaded!', 2000);
    } catch (error) {
      console.error('Error downloading audio:', error);
      this.snackbar.error('Failed to download audio', 2000);
    }
  }

  private estimatePlaybackDuration(morse: string): number {
    const dotDuration = 1.2 / this.wpm();
    const symbols = morse.replace(/ /g, '').length;
    const spaces = (morse.match(/ /g) || []).length;
    const slashes = (morse.match(/\//g) || []).length;
    return ((symbols * dotDuration * 2) + (spaces * dotDuration * 3) + (slashes * dotDuration * 7)) * 1000;
  }

  saveConversion(): void {
    const text = this.textInput().trim();
    const morse = this.morseOutput();

    if (!text || !morse) {
      this.snackbar.warning('Please enter text to convert first', 2000);
      return;
    }

    const saved = this.storageService.saveConversion(text, morse);

    if (saved) {
      this.snackbar.success('Conversion saved!', 2000);
      this.loadSavedConversions();
    } else {
      this.snackbar.warning('This text is already saved', 2000);
    }
  }

  loadConversion(conversion: SavedMorseConversion): void {
    this.textInput.set(conversion.text);
    this.onTextInput();
    this.snackbar.success('Loaded into converter', 2000);
  }

  async copyMorse(morse: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(morse);
      this.snackbar.success('Morse code copied!', 2000);
    } catch (error) {
      this.snackbar.error('Failed to copy', 2000);
    }
  }

  async copyText(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      this.snackbar.success('Text copied!', 2000);
    } catch (error) {
      this.snackbar.error('Failed to copy', 2000);
    }
  }

  async copyAllConversions(): Promise<void> {
    const text = this.storageService.getAllConversionsAsText();
    if (!text) {
      this.snackbar.warning('No conversions to copy', 2000);
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      this.snackbar.success('All conversions copied!', 2000);
    } catch (error) {
      this.snackbar.error('Failed to copy', 2000);
    }
  }

  downloadConversions(): void {
    const text = this.storageService.getAllConversionsAsText();
    if (!text) {
      this.snackbar.warning('No conversions to download', 2000);
      return;
    }

    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    const date = new Date().toISOString().split('T')[0];
    link.download = `morse-code-${date}.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    this.snackbar.success('Downloaded!', 2000);
  }

  clearAllConversions(): void {
    if (this.savedConversions().length === 0) {
      return;
    }

    const confirmed = confirm('Are you sure you want to clear all saved conversions? This cannot be undone.');
    if (confirmed) {
      this.storageService.clearAll();
      this.loadSavedConversions();
      this.snackbar.success('All conversions cleared', 2000);
    }
  }

  deleteConversion(text: string): void {
    this.storageService.deleteConversion(text);
    this.loadSavedConversions();
    this.snackbar.success('Conversion deleted', 2000);
  }

  formatTimestamp(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleString();
  }

  getSupportedChars(): string {
    return this.morseService.getSupportedCharacters();
  }
}
