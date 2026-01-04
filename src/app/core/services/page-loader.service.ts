import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PageLoaderService {
  private platformId = inject(PLATFORM_ID);
  private loading = signal<boolean>(false);
  private loadingCount = 0;
  private timeoutHandle: number | null = null;
  private readonly FAILSAFE_TIMEOUT = 15000; // 15 seconds

  /**
   * Debug flag - when true, loader stays visible permanently
   * Set this to true in browser console: window['pageLoader'].setDebugMode(true)
   */
  private debugMode = false;

  /**
   * Get current loading state
   */
  isLoading(): boolean {
    // If debug mode is on, always return true (loader stays visible)
    if (this.debugMode) {
      return true;
    }
    return this.loading();
  }

  /**
   * Enable debug mode - loader stays visible permanently
   */
  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
    if (enabled) {
      console.log('Page loader debug mode ENABLED - loader will stay visible');
    } else {
      console.log('Page loader debug mode DISABLED - loader will work normally');
    }
  }

  /**
   * Get current debug mode state
   */
  getDebugMode(): boolean {
    return this.debugMode;
  }

  /**
   * Show the page loader
   */
  show(): void {
    this.loadingCount++;
    this.loading.set(true);

    // Start failsafe timeout if not already running (browser only)
    if (isPlatformBrowser(this.platformId) && this.timeoutHandle === null) {
      this.timeoutHandle = window.setTimeout(() => {
        this.onFailsafeTimeout();
      }, this.FAILSAFE_TIMEOUT);
    }
  }

  /**
   * Hide the page loader
   * Uses a counter to handle multiple concurrent loading operations
   */
  hide(): void {
    this.loadingCount--;
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      this.loading.set(false);
      this.clearFailsafeTimeout();
    }
  }

  /**
   * Force hide the loader (reset counter)
   */
  forceHide(): void {
    this.loadingCount = 0;
    this.loading.set(false);
    this.clearFailsafeTimeout();
  }

  /**
   * Clear the failsafe timeout
   */
  private clearFailsafeTimeout(): void {
    if (isPlatformBrowser(this.platformId) && this.timeoutHandle !== null) {
      window.clearTimeout(this.timeoutHandle);
      this.timeoutHandle = null;
    }
  }

  /**
   * Called when the failsafe timeout expires
   * This prevents the loader from spinning indefinitely
   */
  private onFailsafeTimeout(): void {
    console.error('Page loader failsafe timeout triggered after 15 seconds');
    console.error('Loading count was:', this.loadingCount);
    console.error('User agent:', navigator.userAgent);
    console.error('Current URL:', window.location.href);

    // Force hide the loader
    this.loadingCount = 0;
    this.loading.set(false);
    this.timeoutHandle = null;
  }
}
