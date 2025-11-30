import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';
import { MetaService } from '../../core/services/meta.service';

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
    PageHeaderComponent
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
      version: '1.0.0',
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
      version: '1.0.0',
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
      version: '1.0.0',
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
      version: '1.0.0',
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

  // changelog: ChangelogEntry[] = [
  //   {
  //     version: '1.3.0',
  //     date: 'January 15, 2025',
  //     changes: [
  //       {
  //         type: 'added',
  //         description: 'Tip Calculator - Calculate tips and split bills easily'
  //       },
  //       {
  //         type: 'added',
  //         description: 'Quick tip percentage buttons (10%, 15%, 18%, 20%, 25%, 30%, 35%)'
  //       },
  //       {
  //         type: 'improved',
  //         description: 'Enhanced mobile navigation with better category organization'
  //       }
  //     ]
  //   },
  //   {
  //     version: '1.2.0',
  //     date: 'January 10, 2025',
  //     changes: [
  //       {
  //         type: 'added',
  //         description: 'Percentage Calculator with multiple calculation modes'
  //       },
  //       {
  //         type: 'added',
  //         description: 'Real-time calculation as you type'
  //       },
  //       {
  //         type: 'improved',
  //         description: 'Enhanced dark mode with smoother transitions'
  //       },
  //       {
  //         type: 'fixed',
  //         description: 'Fixed color picker accuracy on mobile devices'
  //       }
  //     ]
  //   },
  //   {
  //     version: '1.1.0',
  //     date: 'December 20, 2024',
  //     changes: [
  //       {
  //         type: 'added',
  //         description: 'Temperature Converter with Celsius, Fahrenheit, and Kelvin support'
  //       },
  //       {
  //         type: 'added',
  //         description: 'Unit Converter for length, weight, and volume measurements'
  //       },
  //       {
  //         type: 'improved',
  //         description: 'Improved search functionality with better keyword matching'
  //       },
  //       {
  //         type: 'fixed',
  //         description: 'Fixed gradient generator color picker positioning'
  //       }
  //     ]
  //   },
  //   {
  //     version: '1.0.0',
  //     date: 'December 1, 2024',
  //     changes: [
  //       {
  //         type: 'added',
  //         description: 'Initial release with 15+ tools'
  //       },
  //       {
  //         type: 'added',
  //         description: 'Text tools: Word Counter, Case Converter, Lorem Ipsum Generator'
  //       },
  //       {
  //         type: 'added',
  //         description: 'Color tools: Color Picker, Gradient Generator'
  //       },
  //       {
  //         type: 'added',
  //         description: 'Generator tools: Password Generator, QR Code Generator, UUID Generator'
  //       },
  //       {
  //         type: 'added',
  //         description: 'Time tools: Timestamp Converter, Time Zone Converter'
  //       },
  //       {
  //         type: 'added',
  //         description: 'Dark mode support with theme toggle'
  //       },
  //       {
  //         type: 'added',
  //         description: '100% client-side processing - no data leaves your browser'
  //       }
  //     ]
  //   }
  // ];

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
