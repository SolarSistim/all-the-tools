import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdsenseService {
  private loaded = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  init(): void {
    if (!environment.adsEnabled || this.loaded || !isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.document.querySelector('script[data-adsense="true"]')) {
      this.loaded = true;
      return;
    }

    const script = this.document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7077792325295668';
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('data-adsense', 'true');
    this.document.head.appendChild(script);
    this.loaded = true;
  }
}
