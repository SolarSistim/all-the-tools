import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
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
import { Tool, ToolCategoryMeta } from '../../../../core/models/tool.interface';
import { ToolCardComponent } from '../../../../shared/components/tool-card/tool-card';
import { CtaEmailList } from '../../../reusable-components/cta-email-list/cta-email-list';
import { AdsenseComponent } from '../../../blog/components/adsense/adsense.component';

export type CalculatorType =
  | 'base'
  | 'percentage-increase-decrease'
  | 'discount-calculator'
  | 'tax-calculator'
  | 'profit-margin'
  | 'markup-calculator';

@Component({
  selector: 'app-percentage-calculator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
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
  templateUrl: './percentage-calculator.html',
  styleUrl: './percentage-calculator.scss'
})
export class PercentageCalculatorComponent implements OnInit, OnDestroy {

  toolsService = inject(ToolsService);
  private metaService = inject(MetaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  featuredTools: Tool[] = [];
  categories: ToolCategoryMeta[] = [];

  // Make Math available in template
  protected readonly Math = Math;

  // Current calculator type
  calculatorType = signal<CalculatorType>('base');

  // Base calculator (X% of Y)
  percentage1 = signal<number | null>(null);
  number1 = signal<number | null>(null);
  result1 = signal<number | null>(null);

  // Base calculator (What percent is Y of X)
  part = signal<number | null>(null);
  whole = signal<number | null>(null);
  result2 = signal<number | null>(null);

  // Percentage Increase/Decrease
  oldValue = signal<number | null>(null);
  newValue = signal<number | null>(null);
  percentChange = signal<number | null>(null);
  isIncrease = computed(() => {
    const change = this.percentChange();
    return change !== null && change > 0;
  });
  isDecrease = computed(() => {
    const change = this.percentChange();
    return change !== null && change < 0;
  });

  // Discount Calculator
  originalPrice = signal<number | null>(null);
  discountPercent = signal<number | null>(null);
  discountAmount = signal<number | null>(null);
  finalPrice = signal<number | null>(null);

  // Tax Calculator
  baseAmount = signal<number | null>(null);
  taxRate = signal<number | null>(null);
  taxAmount = signal<number | null>(null);
  totalWithTax = signal<number | null>(null);

  // Profit Margin
  revenue = signal<number | null>(null);
  cost = signal<number | null>(null);
  profitMargin = signal<number | null>(null);
  profitAmount = signal<number | null>(null);

  // Markup Calculator
  costPrice = signal<number | null>(null);
  markupPercent = signal<number | null>(null);
  markupAmount = signal<number | null>(null);
  sellingPrice = signal<number | null>(null);

  ngOnInit(): void {
    // Handle route parameter changes
    this.route.paramMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const variantParam = params.get('variant');
      if (variantParam) {
        this.handleVariantRoute(variantParam as CalculatorType);
      } else {
        this.calculatorType.set('base');
        this.setBaseExamples();
      }
      this.updateMetaTags();
    });

    this.featuredTools = this.toolsService.getFeaturedTools();
    this.categories = this.toolsService.getAllCategories();
  }

  /**
   * Set example values for base calculators
   */
  private setBaseExamples(): void {
    setTimeout(() => {
      // Example for "What is X% of Y"
      this.percentage1.set(20);
      this.number1.set(100);
      this.calculatePercentageOf();

      // Example for "What percent is Y of X"
      this.part.set(25);
      this.whole.set(100);
      this.calculateWhatPercent();
    }, 0);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handle variant route and set example values
   */
  private handleVariantRoute(variant: CalculatorType): void {
    this.calculatorType.set(variant);

    // Set example values based on calculator type
    setTimeout(() => {
      switch (variant) {
        case 'percentage-increase-decrease':
          this.oldValue.set(100);
          this.newValue.set(125);
          this.calculatePercentChange();
          break;

        case 'discount-calculator':
          this.originalPrice.set(100);
          this.discountPercent.set(20);
          this.calculateDiscount();
          break;

        case 'tax-calculator':
          this.baseAmount.set(100);
          this.taxRate.set(8.5);
          this.calculateTax();
          break;

        case 'profit-margin':
          this.revenue.set(150);
          this.cost.set(100);
          this.calculateProfitMargin();
          break;

        case 'markup-calculator':
          this.costPrice.set(100);
          this.markupPercent.set(50);
          this.calculateMarkup();
          break;
      }
    }, 0);
  }

  /**
   * Update meta tags based on calculator type
   */
  private updateMetaTags(): void {
    const type = this.calculatorType();
    let title: string;
    let description: string;
    let url: string;
    let image: string;

    switch (type) {
      case 'percentage-increase-decrease':
        title = 'Percentage Increase/Decrease Calculator | All The Things';
        description = 'Calculate percentage increase or decrease between two values. Perfect for measuring growth rates, price changes, and comparing values over time.';
        url = 'https://www.allthethings.dev/tools/percentage-calculator/percentage-increase-decrease';
        image = 'https://ik.imagekit.io/allthethingsdev/Base%20Number%20Converter%20Tutorial/og-percentage-increase-decrease.jpg';
        break;

      case 'discount-calculator':
        title = 'Discount Calculator - Calculate Sale Price & Savings | All The Things';
        description = 'Calculate final price after discount. Find out how much you save with percentage discounts on any purchase.';
        url = 'https://www.allthethings.dev/tools/percentage-calculator/discount-calculator';
        image = 'https://ik.imagekit.io/allthethingsdev/Base%20Number%20Converter%20Tutorial/og-discount-calculator.jpg';
        break;

      case 'tax-calculator':
        title = 'Sales Tax Calculator - Calculate Tax Amount & Total | All The Things';
        description = 'Calculate sales tax amount and total price. Add tax percentage to any purchase to find the final cost.';
        url = 'https://www.allthethings.dev/tools/percentage-calculator/tax-calculator';
        image = 'https://ik.imagekit.io/allthethingsdev/Base%20Number%20Converter%20Tutorial/og-sales-tax-calculator.jpg';
        break;

      case 'profit-margin':
        title = 'Profit Margin Calculator - Calculate Business Profitability | All The Things';
        description = 'Calculate profit margin percentage from cost and revenue. Essential for business pricing and profitability analysis.';
        url = 'https://www.allthethings.dev/tools/percentage-calculator/profit-margin';
        image = 'https://ik.imagekit.io/allthethingsdev/Base%20Number%20Converter%20Tutorial/og-profit-margin-calculator.jpg';
        break;

      case 'markup-calculator':
        title = 'Markup Calculator - Calculate Selling Price from Cost | All The Things';
        description = 'Calculate selling price from cost and markup percentage. Determine the right pricing for products and services.';
        url = 'https://www.allthethings.dev/tools/percentage-calculator/markup-calculator';
        image = 'https://ik.imagekit.io/allthethingsdev/Base%20Number%20Converter%20Tutorial/og-markup-calculator.jpg';
        break;

      default:
        title = 'Percentage Calculator - Free Online Tool | All The Things';
        description = 'Calculate percentages, percentage increase/decrease, and find what percent one number is of another. Fast, accurate, and completely free.';
        url = 'https://www.allthethings.dev/tools/percentage-calculator';
        image = 'https://www.allthethings.dev/meta-images/og-percentage-calculator.png';
    }

    this.metaService.updateTags({
      title,
      description,
      keywords: ['percentage calculator', 'percent calculator', 'calculate percentage', 'percentage increase', 'percentage decrease', 'online calculator'],
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
    const type = this.calculatorType();
    switch (type) {
      case 'percentage-increase-decrease':
        return 'Percentage Increase/Decrease Calculator';
      case 'discount-calculator':
        return 'Discount Calculator';
      case 'tax-calculator':
        return 'Sales Tax Calculator';
      case 'profit-margin':
        return 'Profit Margin Calculator';
      case 'markup-calculator':
        return 'Markup Calculator';
      default:
        return 'Percentage Calculator';
    }
  }

  /**
   * Get page description for display
   */
  getPageDescription(): string {
    const type = this.calculatorType();
    switch (type) {
      case 'percentage-increase-decrease':
        return 'Calculate percentage increase or decrease between two values. Perfect for measuring growth rates, price changes, and comparing values over time.';
      case 'discount-calculator':
        return 'Calculate final price after discount and see how much you save with percentage discounts.';
      case 'tax-calculator':
        return 'Calculate sales tax amount and total price instantly with any tax rate.';
      case 'profit-margin':
        return 'Calculate profit margin percentage from cost and revenue for business profitability analysis.';
      case 'markup-calculator':
        return 'Calculate selling price from cost and markup percentage to price your products correctly.';
      default:
        return 'Calculate percentages instantly with precision and ease. Perfect for discounts, tips, taxes, grades, and financial calculations.';
    }
  }

  // ========== CALCULATION METHODS ==========

  calculatePercentageOf(): void {
    const pct = this.percentage1();
    const num = this.number1();

    if (pct !== null && num !== null && !isNaN(pct) && !isNaN(num)) {
      this.result1.set((pct / 100) * num);
    } else {
      this.result1.set(null);
    }
  }

  calculateWhatPercent(): void {
    const partVal = this.part();
    const wholeVal = this.whole();

    if (partVal !== null && wholeVal !== null && !isNaN(partVal) && !isNaN(wholeVal) && wholeVal !== 0) {
      this.result2.set((partVal / wholeVal) * 100);
    } else {
      this.result2.set(null);
    }
  }

  calculatePercentChange(): void {
    const oldVal = this.oldValue();
    const newVal = this.newValue();

    if (oldVal !== null && newVal !== null && !isNaN(oldVal) && !isNaN(newVal) && oldVal !== 0) {
      const change = ((newVal - oldVal) / oldVal) * 100;
      this.percentChange.set(change);
    } else {
      this.percentChange.set(null);
    }
  }

  calculateDiscount(): void {
    const price = this.originalPrice();
    const discount = this.discountPercent();

    if (price !== null && discount !== null && !isNaN(price) && !isNaN(discount)) {
      const discountAmt = (discount / 100) * price;
      const final = price - discountAmt;
      this.discountAmount.set(discountAmt);
      this.finalPrice.set(final);
    } else {
      this.discountAmount.set(null);
      this.finalPrice.set(null);
    }
  }

  calculateTax(): void {
    const base = this.baseAmount();
    const rate = this.taxRate();

    if (base !== null && rate !== null && !isNaN(base) && !isNaN(rate)) {
      const tax = (rate / 100) * base;
      const total = base + tax;
      this.taxAmount.set(tax);
      this.totalWithTax.set(total);
    } else {
      this.taxAmount.set(null);
      this.totalWithTax.set(null);
    }
  }

  calculateProfitMargin(): void {
    const rev = this.revenue();
    const costVal = this.cost();

    if (rev !== null && costVal !== null && !isNaN(rev) && !isNaN(costVal) && rev !== 0) {
      const profit = rev - costVal;
      const margin = (profit / rev) * 100;
      this.profitAmount.set(profit);
      this.profitMargin.set(margin);
    } else {
      this.profitAmount.set(null);
      this.profitMargin.set(null);
    }
  }

  calculateMarkup(): void {
    const costVal = this.costPrice();
    const markup = this.markupPercent();

    if (costVal !== null && markup !== null && !isNaN(costVal) && !isNaN(markup)) {
      const markupAmt = (markup / 100) * costVal;
      const selling = costVal + markupAmt;
      this.markupAmount.set(markupAmt);
      this.sellingPrice.set(selling);
    } else {
      this.markupAmount.set(null);
      this.sellingPrice.set(null);
    }
  }

  scrollToCalculators(): void {
    const element = document.querySelector('.calculator-grid');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
