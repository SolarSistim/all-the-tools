import { Injectable } from '@angular/core';

export interface SavedMorseConversion {
  text: string;
  morse: string;
  savedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class MorseStorageService {
  private readonly STORAGE_KEY = 'morse_code_conversions';

  private getStorage(): Storage | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage ?? null;
  }

  constructor() {}

  loadConversions(): SavedMorseConversion[] {
    try {
      const storage = this.getStorage();
      if (!storage) return [];
      const stored = storage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return [];
      }
      return JSON.parse(stored) as SavedMorseConversion[];
    } catch (error) {
      console.error('Error loading Morse conversions from localStorage:', error);
      return [];
    }
  }

  saveConversion(text: string, morse: string): boolean {
    const conversions = this.loadConversions();

    const isDuplicate = conversions.some(conversion => conversion.text === text);
    if (isDuplicate) {
      return false;
    }

    const newConversion: SavedMorseConversion = {
      text,
      morse,
      savedAt: new Date().toISOString()
    };

    conversions.unshift(newConversion);

    try {
      const storage = this.getStorage();
      if (!storage) return false;
      storage.setItem(this.STORAGE_KEY, JSON.stringify(conversions));
      return true;
    } catch (error) {
      console.error('Error saving Morse conversion to localStorage:', error);
      return false;
    }
  }

  clearAll(): void {
    try {
      const storage = this.getStorage();
      if (!storage) return;
      storage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing Morse conversions from localStorage:', error);
    }
  }

  deleteConversion(text: string): void {
    const conversions = this.loadConversions();
    const filtered = conversions.filter(conversion => conversion.text !== text);

    try {
      const storage = this.getStorage();
      if (!storage) return;
      storage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting Morse conversion from localStorage:', error);
    }
  }

  getAllConversionsAsText(): string {
    const conversions = this.loadConversions();
    return conversions.map(conversion => `${conversion.text} = ${conversion.morse}`).join('\n');
  }
}
