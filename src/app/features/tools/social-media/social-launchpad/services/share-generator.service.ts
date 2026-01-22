import { Injectable } from '@angular/core';
import { PlatformId } from '../models/platform.model';

@Injectable({
  providedIn: 'root'
})
export class ShareGeneratorService {
  constructor() {}

  /**
   * Generates a share URL for a specific platform
   */
  generateShareUrl(
    platformId: PlatformId,
    text: string,
    url: string
  ): string {
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);

    switch (platformId) {
      case 'twitter':
        return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;

      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;

      case 'threads':
        return `https://www.threads.net/intent/post?text=${encodedText}%20${encodedUrl}`;

      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

      case 'tumblr':
        return `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encodedUrl}&caption=${encodedText}`;

      case 'mastodon':
        return `https://mastodon.social/share?text=${encodedText}%20${encodedUrl}`;

      case 'bluesky':
        return `https://bsky.app/intent/compose?text=${encodedText}%20${encodedUrl}`;

      case 'truthsocial':
        return `https://truthsocial.com/share?text=${encodedText}%20${encodedUrl}`;

      case 'gab':
        return `https://gab.com/compose?url=${encodedUrl}&text=${encodedText}`;

      case 'parler':
        return `https://parler.com/new-post?message=${encodedText}%20${encodedUrl}`;

      case 'gettr':
        return `https://gettr.com/share?text=${encodedText}%20${encodedUrl}`;

      case 'lemmy':
        return `https://lemmy.ml/create_post?url=${encodedUrl}&title=${encodedText}`;

      case 'digg':
        return `https://digg.com/submit?url=${encodedUrl}&title=${encodedText}`;

      case 'fourchan':
        // 4chan doesn't have direct share URLs, return empty
        return '';

      case 'pinterest':
        return `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`;

      case 'reddit':
        return `https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`;

      case 'medium':
        return `https://medium.com/new-story?url=${encodedUrl}`;

      case 'substack':
        // Substack doesn't have direct share URLs
        return '';

      case 'blogger':
        return `https://www.blogger.com/blog-this.g?u=${encodedUrl}&n=${encodedText}`;

      case 'ghost':
        // Ghost doesn't have universal share URLs
        return '';

      case 'livejournal':
        return `https://www.livejournal.com/update.bml?subject=${encodedText}&event=${encodedUrl}`;

      case 'dreamwidth':
        return `https://www.dreamwidth.org/update.bml?subject=${encodedText}&event=${encodedUrl}`;

      default:
        return '';
    }
  }

  /**
   * Generates share URLs for all selected platforms
   */
  generateAllShareUrls(
    selectedPlatforms: PlatformId[],
    formattedTexts: Map<PlatformId, string>,
    url: string
  ): Map<PlatformId, string> {
    const shareUrls = new Map<PlatformId, string>();

    selectedPlatforms.forEach(platformId => {
      const text = formattedTexts.get(platformId) || '';
      const shareUrl = this.generateShareUrl(platformId, text, url);
      shareUrls.set(platformId, shareUrl);
    });

    return shareUrls;
  }

  /**
   * Opens share URL in a new window
   */
  openShareWindow(url: string, platformName: string): void {
    const width = 600;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    window.open(
      url,
      `share-${platformName}`,
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
  }

  /**
   * Opens all share URLs in new windows
   */
  openAllShareWindows(shareUrls: Map<PlatformId, string>, platformNames: Map<PlatformId, string>): void {
    shareUrls.forEach((url, platformId) => {
      const platformName = platformNames.get(platformId) || platformId;
      // Add a small delay between opening windows to prevent popup blocker
      setTimeout(() => {
        this.openShareWindow(url, platformName);
      }, 100 * Array.from(shareUrls.keys()).indexOf(platformId));
    });
  }

  /**
   * Copies share URL to clipboard
   */
  async copyShareUrl(url: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch (error) {
      console.error('Failed to copy share URL:', error);
      return false;
    }
  }

  /**
   * Copies all formatted texts to clipboard
   */
  async copyAllFormattedTexts(
    formattedTexts: Map<PlatformId, string>,
    platformNames: Map<PlatformId, string>
  ): Promise<boolean> {
    try {
      let allText = '';

      formattedTexts.forEach((text, platformId) => {
        const platformName = platformNames.get(platformId) || platformId;
        allText += `========== ${platformName} ==========\n\n`;
        allText += text;
        allText += '\n\n\n';
      });

      await navigator.clipboard.writeText(allText);
      return true;
    } catch (error) {
      console.error('Failed to copy all formatted texts:', error);
      return false;
    }
  }

  /**
   * Formats share links as copyable text
   */
  formatShareLinksAsText(
    shareUrls: Map<PlatformId, string>,
    platformNames: Map<PlatformId, string>
  ): string {
    let text = '';

    shareUrls.forEach((url, platformId) => {
      const platformName = platformNames.get(platformId) || platformId;
      text += `${platformName}:\n${url}\n\n`;
    });

    return text;
  }
}
