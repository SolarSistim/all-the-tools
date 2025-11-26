import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  // Social links (placeholder for now)
  socialLinks = [
    { name: 'GitHub', icon: 'code', url: '#', tooltip: 'View on GitHub' },
    { name: 'Twitter', icon: 'alternate_email', url: '#', tooltip: 'Follow on Twitter' },
    { name: 'LinkedIn', icon: 'work', url: '#', tooltip: 'Connect on LinkedIn' }
  ];

  // Quick links
  quickLinks = [
    { label: 'Home', route: '/' },
    { label: 'All Tools', route: '/tools' },
    { label: 'About', route: '/about' }
  ];

  // Tool categories
  toolCategories = [
    { label: 'Math & Calculators', route: '/tools', params: { category: 'math' } },
    { label: 'Converters', route: '/tools', params: { category: 'converter' } },
    { label: 'Text Tools', route: '/tools', params: { category: 'text' } },
    { label: 'Generators', route: '/tools', params: { category: 'generator' } }
  ];
}
