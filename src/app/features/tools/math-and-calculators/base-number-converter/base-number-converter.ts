import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BaseNumberService, AllBasesResult } from './base-number.service';
import { MetaService } from '../../../../core/services/meta.service';
import { CustomSnackbarService } from '../../../../core/services/custom-snackbar.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';
import { CtaEmailList } from '../../../reusable-components/cta-email-list/cta-email-list';
import { AdsenseComponent } from '../../../blog/components/adsense/adsense.component';

@Component({
  selector: 'app-base-number-converter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    PageHeaderComponent,
    CtaEmailList,
    AdsenseComponent
  ],
  templateUrl: './base-number-converter.html',
  styleUrl: './base-number-converter.scss'
})
export class BaseNumberConverterComponent implements OnInit {
  private baseService = inject(BaseNumberService);
  private metaService = inject(MetaService);
  private snackbar = inject(CustomSnackbarService);

  input = signal<string>('');
  fromBase = signal<number>(10);
  toBase = signal<number>(2);

  output = signal<string>('');
  errorMessage = signal<string>('');
  allBases = signal<AllBasesResult | null>(null);

  primaryBases = this.baseService.getPrimaryBases();
  extraBases = this.baseService.getExtraBases();
  allBasesArray = computed(() => this.baseService.getSupportedBases());

  ngOnInit(): void {
    this.updateMetaTags();
  }

  private updateMetaTags(): void {
    this.metaService.updateTags({
      title: 'Base Number Converter - Convert Between Number Systems',
      description: 'Convert numbers between binary, octal, decimal, duodecimal, hexadecimal, and base 36. Supports large integers and live conversion.',
      keywords: ['base converter', 'number system converter', 'binary', 'hex', 'decimal', 'octal', 'base conversion'],
      image: 'https://www.allthethings.dev/meta-images/og-base-number-converter.png',
      url: 'https://www.allthethings.dev/tools/base-number-converter'
    });
  }

  onInputChange(): void {
    this.errorMessage.set('');
    const validation = this.baseService.validateInput(this.input(), this.fromBase());

    if (!validation.valid) {
      this.errorMessage.set(validation.error || '');
      this.output.set('');
      this.allBases.set(null);
      return;
    }

    if (!this.input().trim()) {
      this.output.set('');
      this.allBases.set(null);
      return;
    }

    const result = this.baseService.convertFromBase(this.input(), this.fromBase(), this.toBase());
    if (result.success) {
      this.output.set(result.result || '');
    } else {
      this.errorMessage.set(result.error || '');
      this.output.set('');
    }

    const allBasesResult = this.baseService.convertToAllBases(this.input(), this.fromBase());
    this.allBases.set(allBasesResult);
  }

  onFromBaseChange(): void {
    this.onInputChange();
  }

  onToBaseChange(): void {
    this.onInputChange();
  }

  swapBases(): void {
    if (this.output()) {
      this.input.set(this.output());
      const temp = this.fromBase();
      this.fromBase.set(this.toBase());
      this.toBase.set(temp);
      this.onInputChange();
    } else {
      this.snackbar.info('No conversion result to swap', 2000);
    }
  }

  async copyToClipboard(text: string, label: string): Promise<void> {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      this.snackbar.success(`Copied ${label}!`, 2000);
    } catch (error) {
      this.snackbar.error('Failed to copy', 2000);
    }
  }

  getBaseLabel(base: number): string {
    return this.baseService.getBaseLabel(base);
  }

  getBaseValue(base: number): string {
    const allBases = this.allBases();
    if (!allBases) return '';
    const key = `base${base}` as keyof typeof allBases;
    return allBases[key];
  }

  clearInput(): void {
    this.input.set('');
    this.output.set('');
    this.errorMessage.set('');
    this.allBases.set(null);
  }
}
