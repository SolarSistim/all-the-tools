import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';
import { MetaService } from '../../core/services/meta.service';
import { CtaEmailList } from '../reusable-components/cta-email-list/cta-email-list';

interface ChangelogEntry {
  version: string;
  date: string;
  changes: {
    type: 'added' | 'improved' | 'fixed' | 'removed';
    description: string;
    route?: string; // Optional route to link to
  }[];
}

@Component({
  selector: 'app-changelog',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    PageHeaderComponent,
    CtaEmailList
  ],
  templateUrl: './changelog.html',
  styleUrl: './changelog.scss',
})
export class Changelog implements OnInit {
  private metaService = inject(MetaService);

  ngOnInit(): void {
    this.metaService.updateTags({
      title: 'Changelog - All The Tools',
      description: 'View the latest updates, new features, and improvements to All The Tools',
      keywords: ['changelog', 'updates', 'release notes', 'version history'],
      image: 'https://www.allthethings.dev/meta-images/og-home.png',
      url: 'https://www.allthethings.dev/changelog'
    });
  }

  changelog: ChangelogEntry[] = [
    {
      version: '1.2.0',
      date: 'February 5, 2026',
      changes: [
        {
          type: 'added',
          description: 'Online Timer',
          route: '/tools/timer-stopwatch-clock/timer'
        },
        {
          type: 'added',
          description: 'Online Stopwatch',
          route: '/tools/timer-stopwatch-clock/stopwatch'
        }
      ]
    },
    {
      version: '1.2.0',
      date: 'February 4, 2026',
      changes: [
        {
          type: 'added',
          description: 'ASCII Character Reference',
          route: '/tools/ascii-character-reference'
        }
      ]
    },
    {
      version: '1.2.0',
      date: 'January 23, 2026',
      changes: [
        {
          type: 'added',
          description: 'Social Media Launchpad',
          route: '/tools/social-media-launchpad'
        }
      ]
    },
    {
      version: '1.2.0',
      date: 'January 12, 2026',
      changes: [
        {
          type: 'added',
          description: 'On! Nicotine Reward Code Scanner',
          route: '/tools/on-reward-scanner'
        }
      ]
    },
    {
      version: '1.2.0',
      date: 'January 12, 2026',
      changes: [
        {
          type: 'added',
          description: 'Base Number Converter',
          route: '/tools/base-number-converter'
        },
        {
          type: 'added',
          description: 'Photo Filter Studio',
          route: '/tools/photo-filter-studio'
        }
      ]
    },
    {
      version: '1.2.0',
      date: 'January 11, 2026',
      changes: [
        {
          type: 'added',
          description: 'Morse Code Converter',
          route: '/tools/morse-code-converter'
        }
      ]
    },
    {
      version: '1.2.0',
      date: 'January 9, 2026',
      changes: [
        {
          type: 'added',
          description: 'Roman Numeral Converter',
          route: '/tools/roman-numeral-converter'
        }
      ]
    },
    {
      version: '1.2.0',
      date: 'January 8, 2026',
      changes: [
        {
          type: 'added',
          description: 'Barcode Reader',
          route: '/tools/barcode-reader'
        }
      ]
    },
    {
      version: '1.2.0',
      date: 'December 26, 2025',
      changes: [
        {
          type: 'added',
          description: 'Roku Compatibility Checker',
          route: '/tools/roku-compatibility'
        }
      ]
    },
    {
      version: '1.2.0',
      date: 'December 1, 2025',
      changes: [
        {
          type: 'added',
          description: 'Currency Converter',
          route: '/tools/currency-converter'
        },
        {
          type: 'added',
          description: 'Time Zone Converter',
          route: '/tools/time-zone-converter'
        },
        {
          type: 'added',
          description: 'UUID Generator',
          route: '/tools/uuid-generator'
        }
      ]
    },
    {
      version: '1.2.0',
      date: 'December 1, 2025',
      changes: [
        {
          type: 'added',
          description: 'Color Picker',
          route: '/tools/color-picker'
        },
        {
          type: 'added',
          description: 'Gradient Generator',
          route: '/tools/gradient-generator'
        },
        {
          type: 'added',
          description: 'Icon Generator',
          route: '/tools/icon-generator'
        }
      ]
    },
    {
      version: '1.2.0',
      date: 'November 30, 2025',
      changes: [
        {
          type: 'added',
          description: 'QR Code Generator',
          route: '/tools/qr-code-generator'
        }
      ]
    },
    {
      version: '1.2.0',
      date: 'November 29, 2025',
      changes: [
        {
          type: 'added',
          description: 'Password Generator',
          route: '/tools/password-generator'
        },
        {
          type: 'added',
          description: 'Lorem Ipsum Generator',
          route: '/tools/lorem-ipsum'
        }
      ]
    },
    {
      version: '1.2.0',
      date: 'November 28, 2025',
      changes: [
        {
          type: 'added',
          description: 'Unit Converter',
          route: '/tools/unit-converter'
        },
        {
          type: 'added',
          description: 'Case Converter',
          route: '/tools/case-converter'
        },
        {
          type: 'added',
          description: 'Word Counter',
          route: '/tools/word-counter'
        }
      ]
    },
    {
      version: '1.2.0',
      date: 'November 26, 2025',
      changes: [
        {
          type: 'added',
          description: 'Percentage Calculator',
          route: '/tools/percentage-calculator'
        },
        {
          type: 'added',
          description: 'BMI Calculator',
          route: '/tools/bmi-calculator'
        },
        {
          type: 'added',
          description: 'Tip Calculator',
          route: '/tools/tip-calculator'
        }
      ]
    }
  ];

  getChangeIcon(type: string): string {
    switch (type) {
      case 'added': return 'add_circle';
      case 'improved': return 'upgrade';
      case 'fixed': return 'build';
      case 'removed': return 'remove_circle';
      default: return 'circle';
    }
  }

  getChangeClass(type: string): string {
    return `change-${type}`;
  }
}
