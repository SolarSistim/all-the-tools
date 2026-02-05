import { Component, signal, computed, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { CtaEmailList } from '../../../reusable-components/cta-email-list/cta-email-list';
import { AlertDanger } from '../../../reusable-components/alerts/alert-danger/alert-danger';
import { MetaService } from '../../../../core/services/meta.service';
import { AdsenseComponent } from '../../../blog/components/adsense/adsense.component';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

@Component({
  selector: 'app-currency-converter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    CtaEmailList,
    AlertDanger,
    AdsenseComponent
  ],
  templateUrl: './currency-converter.html',
  styleUrl: './currency-converter.scss',
})
export class CurrencyConverter implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  // Major currencies for variant routes
  private readonly majorCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF'];

  // Slug to currency code mapping (supports multiple slugs per currency for SEO)
  private readonly slugToCurrencyMap: Record<string, string> = {
    'usd': 'USD', 'dollar': 'USD', 'us-dollar': 'USD',
    'eur': 'EUR', 'euro': 'EUR',
    'gbp': 'GBP', 'pound': 'GBP', 'british-pound': 'GBP',
    'jpy': 'JPY', 'yen': 'JPY', 'japanese-yen': 'JPY',
    'cad': 'CAD', 'canadian-dollar': 'CAD',
    'aud': 'AUD', 'australian-dollar': 'AUD',
    'chf': 'CHF', 'swiss-franc': 'CHF', 'franc': 'CHF',
    'cny': 'CNY', 'yuan': 'CNY', 'chinese-yuan': 'CNY',
    'inr': 'INR', 'rupee': 'INR', 'indian-rupee': 'INR',
    'mxn': 'MXN', 'mexican-peso': 'MXN',
    'brl': 'BRL', 'real': 'BRL', 'brazilian-real': 'BRL',
    'zar': 'ZAR', 'rand': 'ZAR', 'south-african-rand': 'ZAR',
    'sgd': 'SGD', 'singapore-dollar': 'SGD',
    'nzd': 'NZD', 'new-zealand-dollar': 'NZD',
    'krw': 'KRW', 'won': 'KRW', 'korean-won': 'KRW',
    'sek': 'SEK', 'swedish-krona': 'SEK',
    'nok': 'NOK', 'norwegian-krone': 'NOK',
    'dkk': 'DKK', 'danish-krone': 'DKK',
    'pln': 'PLN', 'zloty': 'PLN', 'polish-zloty': 'PLN',
    'thb': 'THB', 'baht': 'THB', 'thai-baht': 'THB',
    'rub': 'RUB', 'ruble': 'RUB', 'russian-ruble': 'RUB'
  };

  // Currency code to primary slug mapping (for URL generation - SEO-friendly full names)
  private readonly currencyToSlugMap: Record<string, string> = {
    'USD': 'us-dollar', 'EUR': 'euro', 'GBP': 'british-pound', 'JPY': 'japanese-yen',
    'CAD': 'canadian-dollar', 'AUD': 'australian-dollar', 'CHF': 'swiss-franc', 'CNY': 'chinese-yuan',
    'INR': 'indian-rupee', 'MXN': 'mexican-peso', 'BRL': 'brazilian-real', 'ZAR': 'south-african-rand',
    'SGD': 'singapore-dollar', 'NZD': 'new-zealand-dollar', 'KRW': 'korean-won', 'SEK': 'swedish-krona',
    'NOK': 'norwegian-krone', 'DKK': 'danish-krone', 'PLN': 'polish-zloty', 'THB': 'thai-baht',
    'RUB': 'russian-ruble'
  };

  // Track if we're on a variant route
  isVariantRoute = signal<boolean>(false);

  // Amount signals
  fromAmount = signal<number>(1);
  toAmount = signal<number>(0);

  // Currency signals
  fromCurrency = signal<string>('USD');
  toCurrency = signal<string>('EUR');

  // Available currencies with static exchange rates (relative to USD)
  currencies: Currency[] = [
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
    { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
    { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
  ];

  // Static exchange rates (relative to 1 USD)
  // Note: These are approximate rates and should be updated regularly in production
  private exchangeRates: { [key: string]: number } = {
    USD: 1.00,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.50,
    CAD: 1.36,
    AUD: 1.53,
    CHF: 0.88,
    CNY: 7.24,
    INR: 83.12,
    MXN: 17.08,
    BRL: 4.97,
    ZAR: 18.65,
    SGD: 1.34,
    NZD: 1.65,
    KRW: 1320.50,
    SEK: 10.52,
    NOK: 10.78,
    DKK: 6.88,
    PLN: 3.98,
    THB: 35.42,
    RUB: 92.50,
  };

  private metaService = inject(MetaService);

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const pairParam = params.get('pair');
      if (pairParam) {
        this.handlePairRoute(pairParam);
        this.isVariantRoute.set(true);
      } else {
        this.isVariantRoute.set(false);
      }
      this.updateMetaTags();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handle variant route parameter (e.g., 'usd-to-eur', 'euro-to-ruble')
   */
  private handlePairRoute(pair: string): void {
    const parts = pair.split('-to-');
    if (parts.length !== 2) return;

    const [fromSlug, toSlug] = parts;
    const fromCode = this.slugToCurrencyMap[fromSlug.toLowerCase()];
    const toCode = this.slugToCurrencyMap[toSlug.toLowerCase()];

    if (fromCode && toCode) {
      this.fromCurrency.set(fromCode);
      this.toCurrency.set(toCode);
      this.fromAmount.set(100); // Set a meaningful default amount
      this.convertFromCurrency();
    }
  }

  /**
   * Update meta tags based on current state (variant or base route)
   */
  private updateMetaTags(): void {
    const fromCode = this.fromCurrency();
    const toCode = this.toCurrency();
    const fromName = this.getCurrencyName(fromCode);
    const toName = this.getCurrencyName(toCode);
    const fromSlug = this.currencyToSlugMap[fromCode];
    const toSlug = this.currencyToSlugMap[toCode];

    if (this.isVariantRoute() && fromSlug && toSlug) {
      // Dynamic meta for variant pages
      const title = `${fromName} to ${toName} Converter | Fast & Private | AllTheThings`;
      const description = `Convert ${fromName} (${fromCode}) to ${toName} (${toCode}) instantly. Free currency converter with approximate exchange rates. ${this.getCurrencySymbol(fromCode)}1 ${fromCode} = ${this.getCurrencySymbol(toCode)}${this.currentRate().toFixed(4)} ${toCode}. All calculations happen in your browser for complete privacy.`;
      const url = `https://www.allthethings.dev/tools/currency-converter/${fromSlug}-to-${toSlug}`;
      const image = `https://www.allthethings.dev/meta-images/og-${fromSlug}-to-${toSlug}.jpg`;

      this.metaService.updateTags({
        title,
        description,
        keywords: [
          `${fromCode} to ${toCode}`,
          `${fromName.toLowerCase()} to ${toName.toLowerCase()}`,
          `convert ${fromCode} to ${toCode}`,
          `${fromCode} ${toCode} converter`,
          `${fromCode} ${toCode} exchange rate`,
          'currency converter',
          'exchange rate calculator',
          'forex converter'
        ],
        image,
        url,
        jsonLd: this.metaService.buildToolJsonLd({
          name: title,
          description,
          url,
          image
        })
      });
    } else {
      // Default meta for base page
      this.metaService.updateTags({
        title: 'Currency Converter - Exchange Rates for 20+ Currencies',
        description: 'Convert between 20+ world currencies with approximate exchange rates. Fast, accurate currency conversion for USD, EUR, GBP, JPY, and more.',
        keywords: ['currency converter', 'exchange rate', 'currency exchange', 'forex converter', 'money converter', 'currency calculator', 'foreign exchange', 'convert currency', 'USD to EUR', 'exchange rates'],
        image: 'https://www.allthethings.dev/meta-images/og-currency-converter.png',
        url: 'https://www.allthethings.dev/tools/currency-converter',
        jsonLd: this.metaService.buildToolJsonLd({
          name: 'Currency Converter - Exchange Rates for 20+ Currencies',
          description: 'Convert between 20+ world currencies with approximate exchange rates. Fast, accurate currency conversion for USD, EUR, GBP, JPY, and more.',
          url: 'https://www.allthethings.dev/tools/currency-converter',
          image: 'https://www.allthethings.dev/meta-images/og-currency-converter.png'
        })
      });
    }
  }

  /**
   * Get the page title based on current route
   */
  getPageTitle(): string {
    if (this.isVariantRoute()) {
      const fromName = this.getCurrencyName(this.fromCurrency());
      const toName = this.getCurrencyName(this.toCurrency());
      return `${fromName} to ${toName} Converter`;
    }
    return 'Currency Converter';
  }

  /**
   * Get the page subtitle based on current route
   */
  getPageSubtitle(): string {
    if (this.isVariantRoute()) {
      const fromCode = this.fromCurrency();
      const toCode = this.toCurrency();
      const fromName = this.getCurrencyName(fromCode);
      const toName = this.getCurrencyName(toCode);
      return `Convert ${fromName} (${fromCode}) to ${toName} (${toCode}) instantly with approximate exchange rates. All calculations happen in your browser.`;
    }
    return 'Convert between 21 major world currencies using available exchange rate data. Check exchange rates quickly for reference purposes.';
  }

  // Get current exchange rate
  currentRate = computed(() => {
    const fromRate = this.exchangeRates[this.fromCurrency()];
    const toRate = this.exchangeRates[this.toCurrency()];
    return toRate / fromRate;
  });

  // Get formatted rate display
  rateDisplay = computed(() => {
    const rate = this.currentRate();
    const fromSymbol = this.getCurrencySymbol(this.fromCurrency());
    const toSymbol = this.getCurrencySymbol(this.toCurrency());
    return `${fromSymbol}1 ${this.fromCurrency()} = ${toSymbol}${rate.toFixed(4)} ${this.toCurrency()}`;
  });

  constructor() {
    // Initialize with default conversion
    this.convertFromCurrency();
  }

  /**
   * Convert from currency to target currency
   */
  convertFromCurrency(): void {
    const amount = this.fromAmount();
    const rate = this.currentRate();
    const result = amount * rate;
    this.toAmount.set(Math.round(result * 100) / 100);
  }

  /**
   * Convert from target currency to base currency
   */
  convertToCurrency(): void {
    const amount = this.toAmount();
    const rate = this.currentRate();
    const result = amount / rate;
    this.fromAmount.set(Math.round(result * 100) / 100);
  }

  /**
   * Swap currencies
   */
  swapCurrencies(): void {
    const tempCurrency = this.fromCurrency();
    const tempAmount = this.fromAmount();

    this.fromCurrency.set(this.toCurrency());
    this.toCurrency.set(tempCurrency);

    this.fromAmount.set(this.toAmount());
    this.toAmount.set(tempAmount);

    this.updateRouteIfVariant();
  }

  /**
   * Get currency symbol by code
   */
  getCurrencySymbol(code: string): string {
    const currency = this.currencies.find(c => c.code === code);
    return currency?.symbol || code;
  }

  /**
   * Get currency flag by code
   */
  getCurrencyFlag(code: string): string {
    const currency = this.currencies.find(c => c.code === code);
    return currency?.flag || '';
  }

  /**
   * Get currency name by code
   */
  getCurrencyName(code: string): string {
    const currency = this.currencies.find(c => c.code === code);
    return currency?.name || code;
  }

  /**
   * Format number with appropriate decimal places
   */
  formatAmount(amount: number): string {
    return amount.toFixed(2);
  }

  /**
   * Handle amount input change
   */
  onFromAmountChange(value: string): void {
    const numValue = parseFloat(value) || 0;
    const rounded = Math.round(numValue * 100) / 100;
    this.fromAmount.set(rounded);
    this.convertFromCurrency();
  }

  /**
   * Handle target amount input change
   */
  onToAmountChange(value: string): void {
    const numValue = parseFloat(value) || 0;
    const rounded = Math.round(numValue * 100) / 100;
    this.toAmount.set(rounded);
    this.convertToCurrency();
  }

  /**
   * Handle currency change
   */
  onCurrencyChange(): void {
    this.convertFromCurrency();
    this.updateRouteIfVariant();
  }

  /**
   * Update URL if on a variant route and both currencies are supported
   */
  private updateRouteIfVariant(): void {
    if (!this.isVariantRoute()) return;

    const fromSlug = this.currencyToSlugMap[this.fromCurrency()];
    const toSlug = this.currencyToSlugMap[this.toCurrency()];

    if (fromSlug && toSlug) {
      const newPair = `${fromSlug}-to-${toSlug}`;
      this.router.navigate(['/tools/currency-converter', newPair], {
        replaceUrl: true
      });
    }
  }

  scrollToConverter(): void {
    const element = document.querySelector('.converter-card');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

}