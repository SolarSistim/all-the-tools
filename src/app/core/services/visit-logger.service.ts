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
   * Deferred by 3 seconds to improve initial page load performance
   */
  logVisit(urlPath: string): void {
    // Only run in browser
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Defer all logging by 3 seconds to improve page load performance
    setTimeout(() => {
      // Log initial visit to visitor_logs (once per session)
      if (!this.hasLogged) {
        this.hasLogged = true;
        this.sendLog(urlPath, 'visitor_logs');
      }

      // Log page view to page_views (every navigation)
      // Use requestIdleCallback to ensure this doesn't impact performance
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => this.sendLog(urlPath, 'page_views'), { timeout: 2000 });
      } else {
        // Fallback for browsers that don't support requestIdleCallback
        setTimeout(() => this.sendLog(urlPath, 'page_views'), 100);
      }
    }, 3000); // Wait 3 seconds before logging
  }

  /**
   * Send the log data to the Netlify function
   */
  private async sendLog(urlPath: string, sheetName: string): Promise<void> {
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
        sheetName: sheetName, // Add sheet name to request
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

  /**
   * Log an audio player event (play/pause)
   */
  logAudioEvent(action: 'play' | 'pause', urlPath: string): void {
    // Only run in browser
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Use requestIdleCallback to ensure this doesn't impact performance
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => this.sendAudioEventLog(action, urlPath), { timeout: 2000 });
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      setTimeout(() => this.sendAudioEventLog(action, urlPath), 100);
    }
  }

  /**
   * Send audio event data to the Netlify function
   */
  private async sendAudioEventLog(action: 'play' | 'pause', urlPath: string): Promise<void> {
    try {
      const audioEventData = {
        action: action,
        urlPath: urlPath,
        sessionId: this.sessionId,
        deviceType: this.getDeviceType(),
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
      };

      // Send to Netlify function (fire and forget)
      fetch('/.netlify/functions/log-audio-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(audioEventData),
        // Use keepalive to ensure the request completes even if user navigates away
        keepalive: true,
      }).catch(err => {
        // Silently fail - we don't want to impact user experience
        console.debug('Audio event logging failed:', err);
      });
    } catch (error) {
      // Silently fail
      console.debug('Error preparing audio event log:', error);
    }
  }
}