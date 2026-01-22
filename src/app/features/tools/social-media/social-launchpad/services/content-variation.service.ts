import { Injectable, inject } from '@angular/core';
import { ContentVariation } from '../models/platform.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ContentVariationService {
  private localStorageService = inject(LocalStorageService);

  constructor() {}

  /**
   * Creates a new variation from current content
   */
  createVariation(
    name: string,
    description: string,
    hashtags: string[]
  ): ContentVariation | null {
    const variations = this.localStorageService.loadVariations();

    if (variations.length >= 5) {
      return null;
    }

    const variation: ContentVariation = {
      id: this.generateId(),
      name: name || `Variation ${variations.length + 1}`,
      description,
      hashtags,
      createdAt: new Date().toISOString()
    };

    const saved = this.localStorageService.saveVariation(variation);
    return saved ? variation : null;
  }

  /**
   * Gets all variations
   */
  getAllVariations(): ContentVariation[] {
    return this.localStorageService.loadVariations();
  }

  /**
   * Gets a specific variation by ID
   */
  getVariation(id: string): ContentVariation | null {
    const variations = this.localStorageService.loadVariations();
    return variations.find(v => v.id === id) || null;
  }

  /**
   * Updates an existing variation
   */
  updateVariation(id: string, updates: Partial<ContentVariation>): boolean {
    const variations = this.localStorageService.loadVariations();
    const index = variations.findIndex(v => v.id === id);

    if (index === -1) {
      return false;
    }

    variations[index] = { ...variations[index], ...updates };

    try {
      localStorage.setItem('sml-variations', JSON.stringify(variations));
      return true;
    } catch (error) {
      console.error('Failed to update variation:', error);
      return false;
    }
  }

  /**
   * Deletes a variation
   */
  deleteVariation(id: string): void {
    this.localStorageService.deleteVariation(id);
  }

  /**
   * Deletes all variations
   */
  deleteAllVariations(): void {
    this.localStorageService.clearAllVariations();
  }

  /**
   * Generates a unique ID for a variation
   */
  private generateId(): string {
    return `var_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Checks if more variations can be created
   */
  canCreateMore(): boolean {
    const variations = this.localStorageService.loadVariations();
    return variations.length < 5;
  }

  /**
   * Gets the count of existing variations
   */
  getVariationCount(): number {
    return this.localStorageService.loadVariations().length;
  }

  /**
   * Duplicates a variation
   */
  duplicateVariation(id: string): ContentVariation | null {
    const original = this.getVariation(id);
    if (!original) {
      return null;
    }

    return this.createVariation(
      `${original.name} (Copy)`,
      original.description,
      [...original.hashtags]
    );
  }

  /**
   * Exports all variations as JSON
   */
  exportVariations(): string {
    const variations = this.localStorageService.loadVariations();
    return JSON.stringify(variations, null, 2);
  }

  /**
   * Imports variations from JSON
   */
  importVariations(jsonString: string): boolean {
    try {
      const variations: ContentVariation[] = JSON.parse(jsonString);

      if (!Array.isArray(variations)) {
        return false;
      }

      // Validate structure
      const isValid = variations.every(v =>
        v.id && v.name && v.description && Array.isArray(v.hashtags) && v.createdAt
      );

      if (!isValid) {
        return false;
      }

      // Save to localStorage
      localStorage.setItem('sml-variations', JSON.stringify(variations));
      return true;
    } catch (error) {
      console.error('Failed to import variations:', error);
      return false;
    }
  }
}
