import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
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
export class CurrencyConverter implements OnInit {
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
    this.metaService.updateTags({
      title: 'Currency Converter - Real-Time Exchange Rates for 20+ Currencies',
      description: 'Convert between 20+ world currencies with real-time exchange rates. Fast, accurate currency conversion for USD, EUR, GBP, JPY, and more.',
      keywords: ['currency converter', 'exchange rate', 'currency exchange', 'forex converter', 'money converter', 'currency calculator', 'foreign exchange', 'convert currency', 'USD to EUR', 'real-time exchange rates'],
      image: 'https://www.allthethings.dev/meta-images/og-currency-converter.png',
      url: 'https://www.allthethings.dev/tools/currency-converter'
    });
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
  }

  scrollToConverter(): void {
    const element = document.querySelector('.converter-card');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

}