import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageLoaderService {
  private loading = signal<boolean>(false);
  private loadingCount = 0;

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
    }
  }

  /**
   * Force hide the loader (reset counter)
   */
  forceHide(): void {
    this.loadingCount = 0;
    this.loading.set(false);
  }
}
