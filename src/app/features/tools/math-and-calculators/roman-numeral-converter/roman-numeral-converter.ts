import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RomanNumeralStorageService, SavedConversion } from '../services/roman-numeral-storage.service';
import { MetaService } from '../../../../core/services/meta.service';
import { CustomSnackbarService } from '../../../../core/services/custom-snackbar.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';
import { CtaEmailList } from '../../../reusable-components/cta-email-list/cta-email-list';
import { AdsenseComponent } from '../../../blog/components/adsense/adsense.component';

@Component({
  selector: 'app-roman-numeral-converter',
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
    MatCheckboxModule,
    PageHeaderComponent,
    CtaEmailList,
    AdsenseComponent
  ],
  templateUrl: './roman-numeral-converter.html',
  styleUrl: './roman-numeral-converter.scss',
})
export class RomanNumeralConverter implements OnInit {
  private metaService = inject(MetaService);
  private snackbar = inject(CustomSnackbarService);
  private storageService = inject(RomanNumeralStorageService);

  // State management
  numberInput = signal<string>('');
  romanNumeral = signal<string>('');
  savedConversions = signal<SavedConversion[]>([]);
  errorMessage = signal<string>('');
  useVinculum = signal<boolean>(false);

  displayedColumns: string[] = ['number', 'roman', 'timestamp', 'actions'];

  ngOnInit(): void {
    this.updateMetaTags();
    this.migrateOldConversions();
    this.loadSavedConversions();
  }

  private updateMetaTags(): void {
    this.metaService.updateTags({
      title: 'Roman Numeral Converter - Convert Numbers to Roman Numerals',
      description: 'Free online Roman numeral converter. Convert numbers 1-3,999,999 to Roman numerals with vinculum support. Save conversions, download as text, and manage your conversion history locally.',
      keywords: ['roman numeral converter', 'number converter', 'roman numerals', 'ancient numerals', 'numeral conversion', 'vinculum'],
      image: 'https://www.allthethings.dev/meta-images/og-roman-numeral-converter.png',
      url: 'https://www.allthethings.dev/tools/roman-numeral-converter',
      jsonLd: this.metaService.buildToolJsonLd({
        name: 'Roman Numeral Converter - Convert Numbers to Roman Numerals',
        description: 'Free online Roman numeral converter. Convert numbers 1-3,999,999 to Roman numerals with vinculum support. Save conversions, download as text, and manage your conversion history locally.',
        url: 'https://www.allthethings.dev/tools/roman-numeral-converter',
        image: 'https://www.allthethings.dev/meta-images/og-roman-numeral-converter.png'
      })
    });
  }

  private loadSavedConversions(): void {
    const conversions = this.storageService.loadConversions();
    this.savedConversions.set(conversions);
  }

  /**
   * Migrate old HTML-based conversions to Unicode format
   */
  private migrateOldConversions(): void {
    const conversions = this.storageService.loadConversions();
    let needsMigration = false;

    const migratedConversions = conversions.map(conversion => {
      // Check if the roman numeral contains HTML tags
      if (conversion.roman.includes('<span')) {
        needsMigration = true;

        // Extract the text from HTML: <span class="vinculum">MCCXXXII</span>CDLVI
        const vinculumMatch = conversion.roman.match(/<span class="vinculum">(.*?)<\/span>(.*)/);

        if (vinculumMatch) {
          // Convert HTML vinculum to Unicode
          const thousandsPart = vinculumMatch[1];
          const remainderPart = vinculumMatch[2];
          const unicodeVinculum = this.addVinculum(thousandsPart);

          return {
            ...conversion,
            roman: unicodeVinculum + remainderPart
          };
        }
      }

      return conversion;
    });

    // Save migrated conversions if any were updated
    if (needsMigration) {
      this.storageService.saveAllConversions(migratedConversions);
    }
  }

  /**
   * Convert number to Roman numeral
   */
  private convertToRoman(num: number): string {
    const maxNumber = this.useVinculum() ? 3999999 : 3999;

    if (num < 1 || num > maxNumber) {
      return '';
    }

    // If using vinculum and number is >= 1000, handle thousands separately
    if (this.useVinculum() && num >= 1000) {
      const thousands = Math.floor(num / 1000);
      const remainder = num % 1000;

      // Convert thousands part (this will be shown with vinculum/overline)
      const thousandsPart = this.convertToRomanBasic(thousands);

      // Convert remainder part (shown normally)
      const remainderPart = remainder > 0 ? this.convertToRomanBasic(remainder) : '';

      // Add Unicode combining overline (U+0305) to each character in thousands part
      const vinculumPart = this.addVinculum(thousandsPart);

      return vinculumPart + remainderPart;
    }

    return this.convertToRomanBasic(num);
  }

  /**
   * Add Unicode combining overline to each character
   */
  private addVinculum(text: string): string {
    // U+0305 is the combining overline character
    const combiningOverline = '\u0305';
    return text.split('').map(char => char + combiningOverline).join('');
  }

  /**
   * Convert number to basic Roman numeral (1-3999)
   */
  private convertToRomanBasic(num: number): string {
    if (num < 1 || num > 3999) {
      return '';
    }

    const romanNumerals: [number, string][] = [
      [1000, 'M'],
      [900, 'CM'],
      [500, 'D'],
      [400, 'CD'],
      [100, 'C'],
      [90, 'XC'],
      [50, 'L'],
      [40, 'XL'],
      [10, 'X'],
      [9, 'IX'],
      [5, 'V'],
      [4, 'IV'],
      [1, 'I']
    ];

    let result = '';
    let remaining = num;

    for (const [value, numeral] of romanNumerals) {
      while (remaining >= value) {
        result += numeral;
        remaining -= value;
      }
    }

    return result;
  }

  /**
   * Handle input change and convert to Roman numeral
   */
  onNumberInput(): void {
    const input = this.numberInput().trim();
    this.errorMessage.set('');

    if (!input) {
      this.romanNumeral.set('');
      return;
    }

    const num = parseInt(input, 10);

    if (isNaN(num)) {
      this.errorMessage.set('Please enter a valid number');
      this.romanNumeral.set('');
      return;
    }

    const maxNumber = this.useVinculum() ? 3999999 : 3999;
    if (num < 1 || num > maxNumber) {
      this.errorMessage.set(`Number must be between 1 and ${maxNumber.toLocaleString()}`);
      this.romanNumeral.set('');
      return;
    }

    const roman = this.convertToRoman(num);
    this.romanNumeral.set(roman);
  }

  /**
   * Handle vinculum checkbox change
   */
  onVinculumChange(): void {
    // Re-validate and convert with new setting
    this.onNumberInput();
  }

  /**
   * Save current conversion to list
   */
  saveConversion(): void {
    const input = this.numberInput().trim();
    const roman = this.romanNumeral();

    if (!input || !roman) {
      this.snackbar.warning('Please enter a number to convert', 2000);
      return;
    }

    const num = parseInt(input, 10);
    const saved = this.storageService.saveConversion(num, roman);

    if (saved) {
      this.snackbar.success('Conversion saved!', 2000);
      this.loadSavedConversions();
    } else {
      this.snackbar.warning('Conversion already saved', 2000);
    }
  }

  /**
   * Copy a single conversion to clipboard
   */
  async copyConversion(conversion: SavedConversion): Promise<void> {
    const text = `${conversion.number} = ${conversion.roman}`;
    try {
      await navigator.clipboard.writeText(text);
      this.snackbar.success('Copied to clipboard!', 2000);
    } catch (error) {
      this.snackbar.error('Failed to copy', 2000);
    }
  }

  /**
   * Copy all conversions to clipboard
   */
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

  /**
   * Download conversions as text file
   */
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
    link.download = `roman-numerals-${date}.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    this.snackbar.success('Downloaded!', 2000);
  }

  /**
   * Clear all saved conversions
   */
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

  /**
   * Delete a single conversion
   */
  deleteConversion(number: number): void {
    this.storageService.deleteConversion(number);
    this.loadSavedConversions();
    this.snackbar.success('Conversion deleted', 2000);
  }

  /**
   * Format timestamp for display
   */
  formatTimestamp(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleString();
  }
}
