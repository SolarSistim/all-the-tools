import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ContentData, ContentVariation, UserPreferences, PlatformId } from '../models/platform.model';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly CURRENT_CONTENT_KEY = 'sml-current-content';
  private readonly VARIATIONS_KEY = 'sml-variations';
  private readonly PREFERENCES_KEY = 'sml-preferences';
  private readonly MAX_VARIATIONS = 5;

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor() { }

  // Current Content Operations
  saveCurrentContent(content: ContentData): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(this.CURRENT_CONTENT_KEY, JSON.stringify(content));
    } catch (error) {
      console.error('Failed to save current content:', error);
      this.handleStorageError();
    }
  }

  loadCurrentContent(): ContentData | null {
    if (!this.isBrowser) return null;
    try {
      const data = localStorage.getItem(this.CURRENT_CONTENT_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load current content:', error);
      return null;
    }
  }

  clearCurrentContent(): void {
    if (!this.isBrowser) return;
    try {
      localStorage.removeItem(this.CURRENT_CONTENT_KEY);
    } catch (error) {
      console.error('Failed to clear current content:', error);
    }
  }

  // Variation Operations
  saveVariation(variation: ContentVariation): boolean {
    if (!this.isBrowser) return false;
    try {
      const variations = this.loadVariations();

      if (variations.length >= this.MAX_VARIATIONS) {
        console.warn(`Maximum ${this.MAX_VARIATIONS} variations reached`);
        return false;
      }

      variations.push(variation);
      localStorage.setItem(this.VARIATIONS_KEY, JSON.stringify(variations));
      return true;
    } catch (error) {
      console.error('Failed to save variation:', error);
      this.handleStorageError();
      return false;
    }
  }

  loadVariations(): ContentVariation[] {
    if (!this.isBrowser) return [];
    try {
      const data = localStorage.getItem(this.VARIATIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load variations:', error);
      return [];
    }
  }

  deleteVariation(id: string): void {
    if (!this.isBrowser) return;
    try {
      const variations = this.loadVariations().filter(v => v.id !== id);
      localStorage.setItem(this.VARIATIONS_KEY, JSON.stringify(variations));
    } catch (error) {
      console.error('Failed to delete variation:', error);
    }
  }

  clearAllVariations(): void {
    if (!this.isBrowser) return;
    try {
      localStorage.removeItem(this.VARIATIONS_KEY);
    } catch (error) {
      console.error('Failed to clear variations:', error);
    }
  }

  // Preferences Operations
  savePreferences(preferences: UserPreferences): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
      this.handleStorageError();
    }
  }

  loadPreferences(): UserPreferences {
    if (!this.isBrowser) return this.getDefaultPreferences();
    try {
      const data = localStorage.getItem(this.PREFERENCES_KEY);
      return data ? JSON.parse(data) : this.getDefaultPreferences();
    } catch (error) {
      console.error('Failed to load preferences:', error);
      return this.getDefaultPreferences();
    }
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      defaultPlatforms: [] as PlatformId[],
      lowercaseHashtags: false,
      theme: 'dark'
    };
  }

  // Utility Methods
  getStorageUsage(): { used: number; available: number; percentage: number } {
    if (!this.isBrowser) return { used: 0, available: 0, percentage: 0 };
    try {
      let totalSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += localStorage[key].length + key.length;
        }
      }

      const available = 5 * 1024 * 1024; // Assume 5MB limit
      const percentage = (totalSize / available) * 100;

      return {
        used: totalSize,
        available: available,
        percentage: percentage
      };
    } catch (error) {
      console.error('Failed to calculate storage usage:', error);
      return { used: 0, available: 0, percentage: 0 };
    }
  }

  private handleStorageError(): void {
    const usage = this.getStorageUsage();
    if (usage.percentage > 90) {
      console.warn('LocalStorage is nearly full. Consider clearing old variations.');
    }
  }

  clearAll(): void {
    if (!this.isBrowser) return;
    try {
      localStorage.removeItem(this.CURRENT_CONTENT_KEY);
      localStorage.removeItem(this.VARIATIONS_KEY);
      // Don't clear preferences as users would want to keep them
    } catch (error) {
      console.error('Failed to clear all data:', error);
    }
  }
}
