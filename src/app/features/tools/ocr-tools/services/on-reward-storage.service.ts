import { Injectable } from '@angular/core';

export interface ScannedRewardCode {
  code: string;
  scannedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class OnRewardStorageService {
  private readonly STORAGE_KEY = 'onNicotineRewardCodes';

  private getStorage(): Storage | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage ?? null;
  }

  constructor() {}

  /**
   * Load all scanned reward codes from localStorage
   */
  loadScans(): ScannedRewardCode[] {
    try {
      const storage = this.getStorage();
      if (!storage) return [];
      const stored = storage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return [];
      }
      return JSON.parse(stored) as ScannedRewardCode[];
    } catch (error) {
      console.error('Error loading reward codes from localStorage:', error);
      return [];
    }
  }

  /**
   * Save a new reward code scan
   * Returns false if the code already exists (duplicate)
   */
  saveScan(code: string): boolean {
    const scans = this.loadScans();

    // Check for duplicates (case-insensitive)
    const isDuplicate = scans.some(scan => scan.code.toUpperCase() === code.toUpperCase());
    if (isDuplicate) {
      return false;
    }

    // Add new scan at the beginning (newest first)
    const newScan: ScannedRewardCode = {
      code,
      scannedAt: new Date().toISOString()
    };

    scans.unshift(newScan);

    try {
      const storage = this.getStorage();
      if (!storage) return false;
      storage.setItem(this.STORAGE_KEY, JSON.stringify(scans));
      return true;
    } catch (error) {
      console.error('Error saving reward code to localStorage:', error);
      return false;
    }
  }

  /**
   * Clear all scanned reward codes
   */
  clearAll(): void {
    try {
      const storage = this.getStorage();
      if (!storage) return;
      storage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing reward codes from localStorage:', error);
    }
  }

  /**
   * Delete a specific scan by code
   */
  deleteScan(code: string): void {
    const scans = this.loadScans();
    const filtered = scans.filter(scan => scan.code !== code);

    try {
      const storage = this.getStorage();
      if (!storage) return;
      storage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting reward code from localStorage:', error);
    }
  }

  /**
   * Get all codes as a plain text string (one per line)
   */
  getAllCodesAsText(): string {
    const scans = this.loadScans();
    return scans.map(scan => scan.code).join('\n');
  }
}
