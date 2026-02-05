import { Component, inject, signal, computed, OnInit, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';
import { MetaService } from '../../../../core/services/meta.service';
import { CustomSnackbarService } from '../../../../core/services/custom-snackbar.service';
import { ToolsService } from '../../../../core/services/tools.service';
import { Tool, ToolCategoryMeta } from '../../../../core/models/tool.interface';
import { CtaEmailList } from '../../../reusable-components/cta-email-list/cta-email-list';
import { AdsenseComponent } from '../../../blog/components/adsense/adsense.component';
import { RelatedBlogPosts } from '../../../reusable-components/related-blog-posts/related-blog-posts';

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  percentage: number;
}

@Component({
  selector: 'app-password-generator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatCheckboxModule,
    MatSliderModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatChipsModule,
    PageHeaderComponent,
    CtaEmailList,
    AdsenseComponent,
    RelatedBlogPosts
  ],
  templateUrl: './password-generator.html',
  styleUrl: './password-generator.scss',
})
export class PasswordGenerator implements OnInit {
  toolsService = inject(ToolsService);
  private metaService = inject(MetaService);
  private snackbar = inject(CustomSnackbarService);

  // Related tools for cross-linking
  relatedTools = [
    { title: 'UUID Generator', slug: '/tools/uuid-generator' }
  ];

  featuredTools: Tool[] = [];
  categories: ToolCategoryMeta[] = [];

  constructor() {
    // Auto-regenerate password when any option changes
    effect(() => {
      // Track all the option signals
      this.length();
      this.includeUppercase();
      this.includeLowercase();
      this.includeNumbers();
      this.includeSymbols();
      this.excludeSimilar();
      this.excludeAmbiguous();
      this.noDuplicates();
      this.noSequential();

      // Regenerate password without tracking the result
      untracked(() => {
        this.generatePasswordSilently();
      });
    });
  }

  ngOnInit(): void {
    this.metaService.updateTags({
      title: 'Password Generator',
      description: 'Generate strong, secure, random passwords with customizable options. Uppercase, lowercase, numbers, symbols, and advanced security options.',
      keywords: ['password generator', 'secure password', 'random password', 'strong password', 'password creator'],
      image: 'https://www.allthethings.dev/meta-images/og-password-generator.png',
      url: 'https://www.allthethings.dev/tools/password-generator',
      jsonLd: this.metaService.buildToolJsonLd({
        name: 'Password Generator',
        description: 'Generate strong, secure, random passwords with customizable options. Uppercase, lowercase, numbers, symbols, and advanced security options.',
        url: 'https://www.allthethings.dev/tools/password-generator',
        image: 'https://www.allthethings.dev/meta-images/og-password-generator.png'
      })
    });

    this.featuredTools = this.toolsService.getFeaturedTools();
    this.categories = this.toolsService.getAllCategories();
  }

  // Character sets
  private readonly UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private readonly LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
  private readonly NUMBERS = '0123456789';
  private readonly SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  private readonly SIMILAR_CHARS = 'il1Lo0O';
  private readonly AMBIGUOUS_CHARS = '{}[]()/\\\'"`~,;:.<>';

  // Signals for password options
  length = signal<number>(16);
  includeUppercase = signal<boolean>(true);
  includeLowercase = signal<boolean>(true);
  includeNumbers = signal<boolean>(true);
  includeSymbols = signal<boolean>(true);
  excludeSimilar = signal<boolean>(false);
  excludeAmbiguous = signal<boolean>(false);
  noDuplicates = signal<boolean>(false);
  noSequential = signal<boolean>(false);
  passwordCount = signal<number>(1);

  // Generated passwords
  generatedPassword = signal<string>('');
  passwordHistory = signal<string[]>([]);

  // Computed password strength
  passwordStrength = computed(() => this.calculateStrength(this.generatedPassword()));

  /**
   * Generate password silently (with history update) - used by effect
   */
  private generatePasswordSilently(): void {
    const options = {
      length: this.length(),
      includeUppercase: this.includeUppercase(),
      includeLowercase: this.includeLowercase(),
      includeNumbers: this.includeNumbers(),
      includeSymbols: this.includeSymbols(),
      excludeSimilar: this.excludeSimilar(),
      excludeAmbiguous: this.excludeAmbiguous(),
      noDuplicates: this.noDuplicates(),
      noSequential: this.noSequential()
    };

    // Validate that at least one character type is selected
    if (!options.includeUppercase && !options.includeLowercase &&
        !options.includeNumbers && !options.includeSymbols) {
      this.generatedPassword.set('');
      return;
    }

    const password = this.createPassword(options);
    this.generatedPassword.set(password);

    // Add to history (keep last 10)
    if (password) {
      const history = [password, ...this.passwordHistory()].slice(0, 10);
      this.passwordHistory.set(history);
    }
  }

  /**
   * Generate password based on current options (adds to history)
   */
  generatePassword(): void {
    this.generatePasswordSilently();

    const password = this.generatedPassword();
    if (password) {
      // Add to history (keep last 10)
      const history = [password, ...this.passwordHistory()].slice(0, 10);
      this.passwordHistory.set(history);
      this.snackbar.success('New password generated!', 2000);
    }
  }

  /**
   * Generate multiple passwords
   */
  generateMultiple(): void {
    const count = this.passwordCount();
    const passwords: string[] = [];

    for (let i = 0; i < count; i++) {
      const options = {
        length: this.length(),
        includeUppercase: this.includeUppercase(),
        includeLowercase: this.includeLowercase(),
        includeNumbers: this.includeNumbers(),
        includeSymbols: this.includeSymbols(),
        excludeSimilar: this.excludeSimilar(),
        excludeAmbiguous: this.excludeAmbiguous(),
        noDuplicates: this.noDuplicates(),
        noSequential: this.noSequential()
      };
      passwords.push(this.createPassword(options));
    }

    // Add all to history
    const history = [...passwords, ...this.passwordHistory()].slice(0, 10);
    this.passwordHistory.set(history);

    this.snackbar.success(`Generated ${count} password${count > 1 ? 's' : ''}`, 2000);
  }

  /**
   * Create a single password with given options
   */
  private createPassword(options: any): string {
    let charset = '';

    // Build character set
    if (options.includeUppercase) charset += this.UPPERCASE;
    if (options.includeLowercase) charset += this.LOWERCASE;
    if (options.includeNumbers) charset += this.NUMBERS;
    if (options.includeSymbols) charset += this.SYMBOLS;

    // Remove excluded characters
    if (options.excludeSimilar) {
      charset = charset.split('').filter(char => !this.SIMILAR_CHARS.includes(char)).join('');
    }
    if (options.excludeAmbiguous) {
      charset = charset.split('').filter(char => !this.AMBIGUOUS_CHARS.includes(char)).join('');
    }

    if (charset.length === 0) {
      return '';
    }

    let password = '';
    const usedChars = new Set<string>();
    let attempts = 0;
    const maxAttempts = options.length * 10;

    while (password.length < options.length && attempts < maxAttempts) {
      const randomIndex = this.getSecureRandomInt(0, charset.length);
      const char = charset[randomIndex];

      // Check no duplicates
      if (options.noDuplicates && usedChars.has(char)) {
        attempts++;
        continue;
      }

      // Check no sequential
      if (options.noSequential && password.length > 0) {
        const lastChar = password[password.length - 1];
        const lastCharCode = lastChar.charCodeAt(0);
        const currentCharCode = char.charCodeAt(0);

        if (Math.abs(currentCharCode - lastCharCode) === 1) {
          attempts++;
          continue;
        }
      }

      password += char;
      usedChars.add(char);
      attempts = 0;
    }

    // If we couldn't generate a password with the constraints, relax them
    if (password.length < options.length) {
      password = '';
      for (let i = 0; i < options.length; i++) {
        const randomIndex = this.getSecureRandomInt(0, charset.length);
        password += charset[randomIndex];
      }
    }

    return password;
  }

  /**
   * Get cryptographically secure random integer
   */
  private getSecureRandomInt(min: number, max: number): number {
    const range = max - min;
    const randomValues = new Uint32Array(1);
    crypto.getRandomValues(randomValues);
    return min + (randomValues[0] % range);
  }

  /**
   * Calculate password strength
   */
  private calculateStrength(password: string): PasswordStrength {
    if (!password) {
      return { score: 0, label: 'None', color: 'var(--text-tertiary)', percentage: 0 };
    }

    let score = 0;
    const length = password.length;

    // Length scoring
    if (length >= 8) score += 1;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;
    if (length >= 20) score += 1;

    // Character variety
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    // Entropy bonus
    const uniqueChars = new Set(password.split('')).size;
    if (uniqueChars / length > 0.8) score += 1;

    // Map score to strength
    if (score <= 3) {
      return { score, label: 'Weak', color: 'var(--neon-pink)', percentage: 25 };
    } else if (score <= 5) {
      return { score, label: 'Medium', color: 'var(--amber)', percentage: 50 };
    } else if (score <= 7) {
      return { score, label: 'Strong', color: 'var(--neon-cyan)', percentage: 75 };
    } else {
      return { score, label: 'Very Strong', color: 'var(--neon-cyan-bright)', percentage: 100 };
    }
  }

  /**
   * Copy password to clipboard
   */
  async copyToClipboard(password: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(password);
      this.snackbar.success('Password copied to clipboard!', 2000);
    } catch (err) {
      this.snackbar.error('Failed to copy to clipboard', 2000);
    }
  }

  /**
   * Clear password history
   */
  clearHistory(): void {
    this.passwordHistory.set([]);
    this.snackbar.success('History cleared', 2000);
  }

  /**
   * Format slider label
   */
  formatLabel(value: number): string {
    return `${value}`;
  }

  /**
   * Update password length
   */
  updateLength(value: number): void {
    this.length.set(value);
  }

  /**
   * Update password count
   */
  updatePasswordCount(value: number): void {
    this.passwordCount.set(value);
  }

  scrollToGenerator(): void {
    const element = document.querySelector('.password-card');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}