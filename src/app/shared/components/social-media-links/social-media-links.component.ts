import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-social-media-links',
  standalone: true,
  imports: [CommonModule, MatTooltipModule],
  templateUrl: './social-media-links.component.html',
  styleUrl: './social-media-links.component.scss'
})
export class SocialMediaLinksComponent {
  @Input() backgroundVariant: 'light' | 'dark' = 'dark';
  socialLinks = [
    {
      name: 'X (Twitter)',
      logo: '/assets/social-logos/x-logo-256x256.png',
      url: 'https://x.com/AllTheDev',
      tooltip: 'Follow us on X'
    },
    {
      name: 'Tumblr',
      logo: '/assets/social-logos/tumblr-logo-256x256.png',
      url: 'https://www.tumblr.com/blog/allthethingsdotdev',
      tooltip: 'Follow us on Tumblr'
    },
    {
      name: 'Facebook',
      logo: '/assets/social-logos/facebook-logo-256x256.png',
      url: 'https://www.facebook.com/AllTheThingsDotDev',
      tooltip: 'Like us on Facebook'
    },
    {
      name: 'YouTube',
      logo: '/assets/social-logos/youtube-logo-256x256.png',
      url: 'https://www.youtube.com/@AllTheThingsdev',
      tooltip: 'Subscribe on YouTube'
    },
    {
      name: 'TikTok',
      logo: '/assets/social-logos/tiktok-logo-256x256.png',
      url: 'https://www.tiktok.com/@allthethingsdev',
      tooltip: 'Follow us on TikTok'
    },
    {
      name: 'Bluesky',
      logo: '/assets/social-logos/bluesky-logo-256x256.png',
      url: 'https://bsky.app/profile/allthethings-dev.bsky.social',
      tooltip: 'Follow us on Bluesky'
    }
  ];
}
