import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
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
import { RelatedBlogPosts } from '../../../reusable-components/related-blog-posts/related-blog-posts';

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
    AdsenseComponent,
    RelatedBlogPosts
  ],
  templateUrl: './base-number-converter.html',
  styleUrl: './base-number-converter.scss'
})
export class BaseNumberConverterComponent implements OnInit, OnDestroy {
  private baseService = inject(BaseNumberService);
  private metaService = inject(MetaService);
  private snackbar = inject(CustomSnackbarService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  input = signal<string>('');
  fromBase = signal<number>(10);
  toBase = signal<number>(2);

  output = signal<string>('');
  errorMessage = signal<string>('');
  allBases = signal<AllBasesResult | null>(null);

  primaryBases = this.baseService.getPrimaryBases();
  extraBases = this.baseService.getExtraBases();
  allBasesArray = computed(() => this.baseService.getSupportedBases());

  // Mapping between URL slugs and base numbers
  private readonly baseSlugMap: Record<string, number> = {
    'binary': 2,
    'octal': 8,
    'decimal': 10,
    'duodecimal': 12,
    'hexadecimal': 16,
    'base36': 36
  };

  // Reverse mapping for generating URLs
  private readonly baseNumberMap: Record<number, string> = {
    2: 'binary',
    8: 'octal',
    10: 'decimal',
    12: 'duodecimal',
    16: 'hexadecimal',
    36: 'base36'
  };

  // Example values for each base (for variant pages)
  private readonly exampleValues: Record<number, string> = {
    2: '11010110',      // Binary: 214 in decimal
    8: '326',           // Octal: 214 in decimal
    10: '214',          // Decimal: 214
    12: '15A',          // Duodecimal: 214 in decimal
    16: 'D6',           // Hexadecimal: 214 in decimal
    36: '5Y'            // Base-36: 214 in decimal
  };

  relatedBlogPosts = [
    {
      title: 'Base Number Converter Tutorial: How to Convert Between Binary, Octal, Decimal, and Hex',
      slug: 'base-number-converter-tutorial'
    }
  ];

  ngOnInit(): void {
    // Handle route parameter changes
    this.route.paramMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const pairParam = params.get('pair');
      if (pairParam) {
        this.handlePairRoute(pairParam);
      } else {
        // Default: decimal to binary
        this.setDefaults();
      }
      this.updateMetaTags();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Set default values (base page, no pair parameter)
   */
  private setDefaults(): void {
    this.fromBase.set(10);
    this.toBase.set(2);
  }

  /**
   * Parse route parameter and set bases accordingly
   * Example: "binary-to-decimal" -> fromBase: 2, toBase: 10
   * Also sets an example input value for variant pages
   */
  private handlePairRoute(pair: string): void {
    const parts = pair.split('-to-');
    if (parts.length !== 2) {
      this.setDefaults();
      return;
    }

    const [fromSlug, toSlug] = parts;
    const fromBaseNum = this.baseSlugMap[fromSlug];
    const toBaseNum = this.baseSlugMap[toSlug];

    if (fromBaseNum && toBaseNum) {
      this.fromBase.set(fromBaseNum);
      this.toBase.set(toBaseNum);

      // Set example input value for this base and trigger conversion
      const exampleValue = this.exampleValues[fromBaseNum];
      if (exampleValue) {
        this.input.set(exampleValue);
        // Trigger conversion after a short delay to ensure component is ready
        setTimeout(() => this.onInputChange(), 0);
      }
    } else {
      this.setDefaults();
    }
  }

  private updateMetaTags(): void {
    const fromBaseName = this.getBaseLabel(this.fromBase());
    const toBaseName = this.getBaseLabel(this.toBase());
    const fromSlug = this.baseNumberMap[this.fromBase()];
    const toSlug = this.baseNumberMap[this.toBase()];

    // Check if this is a variant page (has specific pair)
    const pairParam = this.route.snapshot.paramMap.get('pair');
    const isVariant = !!pairParam;

    let title: string;
    let description: string;
    let url: string;
    let image: string;

    if (isVariant && fromSlug && toSlug) {
      // Dynamic meta for variant pages
      title = `${fromBaseName} to ${toBaseName} Converter | Fast & Private | AllTheThings`;
      description = `Convert ${fromBaseName.toLowerCase()} (base-${this.fromBase()}) to ${toBaseName.toLowerCase()} (base-${this.toBase()}) instantly. Free, fast, and private number system converter.`;
      url = `https://www.allthethings.dev/tools/base-number-converter/${fromSlug}-to-${toSlug}`;
      image = `https://ik.imagekit.io/allthethingsdev/Base%20Number%20Converter%20Tutorial/og-${fromSlug}-to-${toSlug}.jpg`;
    } else {
      // Default meta for base page
      title = 'Base Number Converter - Convert Between Number Systems';
      description = 'Convert numbers between binary, octal, decimal, duodecimal, hexadecimal, and base 36. Supports large integers and live conversion.';
      url = 'https://www.allthethings.dev/tools/base-number-converter';
      image = 'https://www.allthethings.dev/meta-images/og-base-number-converter.png';
    }

    this.metaService.updateTags({
      title,
      description,
      keywords: ['base converter', 'number system converter', 'binary', 'hex', 'decimal', 'octal', 'base conversion', fromBaseName.toLowerCase(), toBaseName.toLowerCase()],
      image,
      url,
      jsonLd: this.metaService.buildToolJsonLd({
        name: title,
        description,
        url,
        image
      })
    });
  }

  /**
   * Get page title for display
   */
  getPageTitle(): string {
    const pairParam = this.route.snapshot.paramMap.get('pair');
    if (pairParam) {
      const fromBaseName = this.getBaseLabel(this.fromBase());
      const toBaseName = this.getBaseLabel(this.toBase());
      return `${fromBaseName} to ${toBaseName} Converter`;
    }
    return 'Base Number Converter';
  }

  /**
   * Get page description for display
   */
  getPageDescription(): string {
    const pairParam = this.route.snapshot.paramMap.get('pair');
    if (pairParam) {
      const fromBaseName = this.getBaseLabel(this.fromBase());
      const toBaseName = this.getBaseLabel(this.toBase());
      return `Convert ${fromBaseName.toLowerCase()} (base-${this.fromBase()}) to ${toBaseName.toLowerCase()} (base-${this.toBase()}) instantly.`;
    }
    return 'Convert numbers between binary, octal, decimal, duodecimal, hexadecimal, and base 36. Supports large integers and live conversion.';
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
    this.updateRouteForBases();
    this.onInputChange();
  }

  onToBaseChange(): void {
    this.updateRouteForBases();
    this.onInputChange();
  }

  /**
   * Update the URL when bases change (if both bases have valid slugs)
   */
  private updateRouteForBases(): void {
    const fromSlug = this.baseNumberMap[this.fromBase()];
    const toSlug = this.baseNumberMap[this.toBase()];

    if (fromSlug && toSlug) {
      const newUrl = `/tools/base-number-converter/${fromSlug}-to-${toSlug}`;
      this.router.navigate([newUrl], { replaceUrl: true });
    }
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
