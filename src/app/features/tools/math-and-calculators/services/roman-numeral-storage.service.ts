import { Injectable } from '@angular/core';

export interface SavedConversion {
  number: number;
  roman: string;
  savedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class RomanNumeralStorageService {
  private readonly STORAGE_KEY = 'roman_numeral_conversions';

  private getStorage(): Storage | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage ?? null;
  }

  constructor() {}

  /**
   * Load all saved conversions from localStorage
   */
  loadConversions(): SavedConversion[] {
    try {
      const storage = this.getStorage();
      if (!storage) return [];
      const stored = storage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return [];
      }
      return JSON.parse(stored) as SavedConversion[];
    } catch (error) {
      console.error('Error loading conversions from localStorage:', error);
      return [];
    }
  }

  /**
   * Save a new conversion
   * Returns false if the conversion already exists (duplicate)
   */
  saveConversion(number: number, roman: string): boolean {
    const conversions = this.loadConversions();

    // Check for duplicates
    const isDuplicate = conversions.some(conversion => conversion.number === number);
    if (isDuplicate) {
      return false;
    }

    // Add new conversion at the beginning (newest first)
    const newConversion: SavedConversion = {
      number,
      roman,
      savedAt: new Date().toISOString()
    };

    conversions.unshift(newConversion);

    try {
      const storage = this.getStorage();
      if (!storage) return false;
      storage.setItem(this.STORAGE_KEY, JSON.stringify(conversions));
      return true;
    } catch (error) {
      console.error('Error saving conversion to localStorage:', error);
      return false;
    }
  }

  /**
   * Clear all saved conversions
   */
  clearAll(): void {
    try {
      const storage = this.getStorage();
      if (!storage) return;
      storage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing conversions from localStorage:', error);
    }
  }

  /**
   * Delete a specific conversion by number
   */
  deleteConversion(number: number): void {
    const conversions = this.loadConversions();
    const filtered = conversions.filter(conversion => conversion.number !== number);

    try {
      const storage = this.getStorage();
      if (!storage) return;
      storage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting conversion from localStorage:', error);
    }
  }

  /**
   * Save all conversions (useful for migrations)
   */
  saveAllConversions(conversions: SavedConversion[]): void {
    try {
      const storage = this.getStorage();
      if (!storage) return;
      storage.setItem(this.STORAGE_KEY, JSON.stringify(conversions));
    } catch (error) {
      console.error('Error saving all conversions to localStorage:', error);
    }
  }

  /**
   * Get all conversions as a plain text string
   * Format: "Number = Roman Numeral" (one per line)
   */
  getAllConversionsAsText(): string {
    const conversions = this.loadConversions();
    return conversions.map(conversion => `${conversion.number} = ${conversion.roman}`).join('\n');
  }
}
