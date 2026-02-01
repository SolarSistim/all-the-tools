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

  // Social links
  socialLinks = [
    {
      name: 'X (Twitter)',
      logo: '/assets/social-logos/x-logo-64x64.png',
      url: 'https://x.com/AllTheDev',
      tooltip: 'Follow us on X'
    },
    {
      name: 'Tumblr',
      logo: '/assets/social-logos/tumblr-logo-64x64.png',
      url: 'https://www.tumblr.com/blog/allthethingsdotdev',
      tooltip: 'Follow us on Tumblr'
    },
    {
      name: 'Facebook',
      logo: '/assets/social-logos/facebook-logo-64x64.png',
      url: 'https://www.facebook.com/AllTheThingsDotDev',
      tooltip: 'Like us on Facebook'
    },
    {
      name: 'YouTube',
      logo: '/assets/social-logos/youtube-logo-64x64.png',
      url: 'https://www.youtube.com/@AllTheThingsdev',
      tooltip: 'Subscribe on YouTube'
    },
    {
      name: 'TikTok',
      logo: '/assets/social-logos/tiktok-logo-64x64.png',
      url: 'https://www.tiktok.com/@allthethingsdev',
      tooltip: 'Follow us on TikTok'
    },
    {
      name: 'Bluesky',
      logo: '/assets/social-logos/bluesky-logo-64x64.png',
      url: 'https://bsky.app/profile/allthethings-dev.bsky.social',
      tooltip: 'Follow us on Bluesky'
    }
  ];

  // Quick links
  quickLinks = [
    { label: 'Home', route: '/' },
    { label: 'All Tools', route: '/tools' },
    { label: 'Blog', route: '/blog' },
    { label: 'About', route: '/about' }
  ];

  // About & Legal links
  aboutLinks = [
    { label: 'About All The Tools', route: '/about' },
    { label: 'Changelog', route: '/changelog' },
    { label: 'Privacy Policy', route: '/privacy' },
    { label: 'Terms of Service', route: '/terms' },
    { label: 'Accessibility', route: '/accessibility' },
    { label: 'Disclaimer', route: '/disclaimer' },
    { label: 'Contact Us', route: '/contact' }
  ];

  // Tool categories
  toolCategories = [
    { label: 'Math & Calculators', route: '/tools', params: { category: 'math' } },
    { label: 'Converters', route: '/tools', params: { category: 'converter' } },
    { label: 'Text Tools', route: '/tools', params: { category: 'text' } },
    { label: 'Generators', route: '/tools', params: { category: 'generator' } },
    { label: 'Color Tools', route: '/tools', params: { category: 'color' } },
    { label: 'Time & Date', route: '/tools', params: { category: 'time' } },
    { label: 'Image Tools', route: '/tools', params: { category: 'image' } }
  ];
}
