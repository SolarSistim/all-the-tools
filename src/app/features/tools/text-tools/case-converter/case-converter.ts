import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ToolsService } from '../../../../core/services/tools.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';
import { MetaService } from '../../../../core/services/meta.service';
import { Tool, ToolCategoryMeta } from '../../../../core/models/tool.interface';
import { ToolCardComponent } from '../../../../shared/components/tool-card/tool-card';

interface CaseConversion {
  id: string;
  name: string;
  icon: string;
  description: string;
  convert: (text: string) => string;
}

@Component({
  selector: 'app-case-converter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    PageHeaderComponent,
    ToolCardComponent
  ],
  templateUrl: './case-converter.html',
  styleUrl: './case-converter.scss'
})
export class CaseConverter implements OnInit {

  toolsService = inject(ToolsService);
  private metaService = inject(MetaService);
  private snackBar = inject(MatSnackBar);

  featuredTools: Tool[] = [];
  categories: ToolCategoryMeta[] = [];

  ngOnInit(): void {
    this.metaService.updateTags({
      title: 'Case Conversion & Text Transforms',
      description: 'Convert text between different cases: lowercase, UPPERCASE, Title Case, camelCase, snake_case, kebab-case, and more.',
      keywords: ['case converter', 'text transform', 'uppercase', 'lowercase', 'camelCase', 'snake_case'],
      image: 'https://all-the-tools.netlify.app/meta-images/og-case-converter.png',
      url: 'https://all-the-tools.netlify.app/tools/case-converter'
    });

    this.featuredTools = this.toolsService.getFeaturedTools();
    this.categories = this.toolsService.getAllCategories();
  }

  // Input text (signal for reactive updates)
  private _inputText = signal<string>('');
  
  // Getter and setter for ngModel compatibility
  get inputText(): string {
    return this._inputText();
  }
  
  set inputText(value: string) {
    this._inputText.set(value);
  }

  // Available case conversions
  conversions: CaseConversion[] = [
    {
      id: 'lowercase',
      name: 'lowercase',
      icon: 'text_format',
      description: 'Convert to all lowercase letters',
      convert: (text) => text.toLowerCase()
    },
    {
      id: 'uppercase',
      name: 'UPPERCASE',
      icon: 'format_size',
      description: 'Convert to all UPPERCASE letters',
      convert: (text) => text.toUpperCase()
    },
    {
      id: 'titlecase',
      name: 'Title Case',
      icon: 'title',
      description: 'Capitalize The First Letter Of Each Word',
      convert: (text) => {
        return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
      }
    },
    {
      id: 'sentencecase',
      name: 'Sentence case',
      icon: 'format_quote',
      description: 'Capitalize the first letter of each sentence',
      convert: (text) => {
        return text.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (char) => char.toUpperCase());
      }
    },
    {
      id: 'camelcase',
      name: 'camelCase',
      icon: 'code',
      description: 'Convert to camelCase (first word lowercase, rest capitalized)',
      convert: (text) => {
        const words = text.trim().split(/\s+/);
        return words.map((word, index) => {
          word = word.toLowerCase();
          return index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1);
        }).join('');
      }
    },
    {
      id: 'pascalcase',
      name: 'PascalCase',
      icon: 'settings_ethernet',
      description: 'Convert to PascalCase (all words capitalized)',
      convert: (text) => {
        return text.trim().split(/\s+/).map(word =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join('');
      }
    },
    {
      id: 'snakecase',
      name: 'snake_case',
      icon: 'horizontal_rule',
      description: 'Convert to snake_case (words separated by underscores)',
      convert: (text) => {
        return text
          .trim()
          // Insert space before uppercase letters (for camelCase/PascalCase)
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          // Replace non-alphanumeric characters with spaces
          .replace(/[^a-zA-Z0-9]+/g, ' ')
          // Trim and convert to lowercase
          .toLowerCase()
          .trim()
          // Replace spaces with underscores
          .replace(/\s+/g, '_');
      }
    },
    {
      id: 'kebabcase',
      name: 'kebab-case',
      icon: 'remove',
      description: 'Convert to kebab-case (words separated by hyphens)',
      convert: (text) => {
        return text
          .trim()
          // Insert space before uppercase letters (for camelCase/PascalCase)
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          // Replace non-alphanumeric characters with spaces
          .replace(/[^a-zA-Z0-9]+/g, ' ')
          // Trim and convert to lowercase
          .toLowerCase()
          .trim()
          // Replace spaces with hyphens
          .replace(/\s+/g, '-');
      }
    },
    {
      id: 'constantcase',
      name: 'CONSTANT_CASE',
      icon: 'code',
      description: 'Convert to CONSTANT_CASE (uppercase with underscores)',
      convert: (text) => {
        return text
          .trim()
          // Insert space before uppercase letters (for camelCase/PascalCase)
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          // Replace non-alphanumeric characters with spaces
          .replace(/[^a-zA-Z0-9]+/g, ' ')
          // Trim and convert to uppercase
          .toUpperCase()
          .trim()
          // Replace spaces with underscores
          .replace(/\s+/g, '_');
      }
    },
    {
      id: 'alternating',
      name: 'aLtErNaTiNg cAsE',
      icon: 'swap_vert',
      description: 'Alternate between lowercase and uppercase letters',
      convert: (text) => {
        return text.split('').map((char, index) =>
          index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
        ).join('');
      }
    }
  ];

  /**
   * Apply a specific case conversion
   */
  applyConversion(conversion: CaseConversion): void {
    const text = this._inputText();
    if (!text) {
      this.snackBar.open('Please enter some text first', 'Close', {
        duration: 2000
      });
      return;
    }
    this._inputText.set(conversion.convert(text));
  }

  /**
   * Copy text to clipboard
   */
  async copyToClipboard(): Promise<void> {
    const text = this._inputText();
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
   * Clear all text
   */
  clearText(): void {
    this._inputText.set('');
  }

  /**
   * Get current input text value (for use in templates)
   */
  getInputText(): string {
    return this._inputText();
  }

  /**
   * Get a short excerpt of the input text for previews (max 50 characters)
   */
  getPreviewText(): string {
    const text = this._inputText() || 'Sample Text';
    const maxLength = 50;
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }
}