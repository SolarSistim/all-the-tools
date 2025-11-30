import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class VisitLoggerService {
  private platformId = inject(PLATFORM_ID);
  private sessionId: string = '';
  private hasLogged: boolean = false;

  constructor() {
    // Only run in browser
    if (isPlatformBrowser(this.platformId)) {
      this.sessionId = this.getOrCreateSessionId();
    }
  }

  /**
   * Log a page visit asynchronously
   * This won't block the page load
   */
  logVisit(urlPath: string): void {
    // Only run in browser and only log once per session
    if (!isPlatformBrowser(this.platformId) || this.hasLogged) {
      return;
    }

    // Mark as logged to prevent duplicate logs
    this.hasLogged = true;

    // Use requestIdleCallback to ensure this doesn't impact performance
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => this.sendLog(urlPath), { timeout: 2000 });
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      setTimeout(() => this.sendLog(urlPath), 100);
    }
  }

  /**
   * Send the log data to the Netlify function
   */
  private async sendLog(urlPath: string): Promise<void> {
    try {
      const visitorData = {
        referrer: document.referrer,
        urlPath: urlPath,
        sessionId: this.sessionId,
        deviceType: this.getDeviceType(),
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      // Send to Netlify function (fire and forget)
      fetch('/.netlify/functions/log-visit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visitorData),
        // Use keepalive to ensure the request completes even if user navigates away
        keepalive: true,
      }).catch(err => {
        // Silently fail - we don't want to impact user experience
        console.debug('Visit logging failed:', err);
      });
    } catch (error) {
      // Silently fail
      console.debug('Error preparing visit log:', error);
    }
  }

  /**
   * Get or create a session ID
   */
  private getOrCreateSessionId(): string {
    const storageKey = 'visitor_session_id';
    
    try {
      let sessionId = sessionStorage.getItem(storageKey);
      
      if (!sessionId) {
        sessionId = this.generateSessionId();
        sessionStorage.setItem(storageKey, sessionId);
      }
      
      return sessionId;
    } catch (error) {
      // If sessionStorage is not available, generate a temporary ID
      return this.generateSessionId();
    }
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Detect device type
   */
  private getDeviceType(): string {
    const ua = navigator.userAgent;
    
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'Tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'Mobile';
    }
    return 'Desktop';
  }
}