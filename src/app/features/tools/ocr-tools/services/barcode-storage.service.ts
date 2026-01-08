import { Injectable } from '@angular/core';

export interface ScannedBarcode {
  code: string;
  format: string;
  scannedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class BarcodeStorageService {
  private readonly STORAGE_KEY = 'barcode_reader_scans';

  private getStorage(): Storage | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage ?? null;
  }

  constructor() {}

  /**
   * Load all scanned barcodes from localStorage
   */
  loadScans(): ScannedBarcode[] {
    try {
      const storage = this.getStorage();
      if (!storage) return [];
      const stored = storage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return [];
      }
      return JSON.parse(stored) as ScannedBarcode[];
    } catch (error) {
      console.error('Error loading scans from localStorage:', error);
      return [];
    }
  }

  /**
   * Save a new barcode scan
   * Returns false if the barcode already exists (duplicate)
   */
  saveScan(code: string, format: string = 'unknown'): boolean {
    const scans = this.loadScans();

    // Check for duplicates
    const isDuplicate = scans.some(scan => scan.code === code);
    if (isDuplicate) {
      return false;
    }

    // Add new scan at the beginning (newest first)
    const newScan: ScannedBarcode = {
      code,
      format,
      scannedAt: new Date().toISOString()
    };

    scans.unshift(newScan);

    try {
      const storage = this.getStorage();
      if (!storage) return false;
      storage.setItem(this.STORAGE_KEY, JSON.stringify(scans));
      return true;
    } catch (error) {
      console.error('Error saving scan to localStorage:', error);
      return false;
    }
  }

  /**
   * Clear all scanned barcodes
   */
  clearAll(): void {
    try {
      const storage = this.getStorage();
      if (!storage) return;
      storage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing scans from localStorage:', error);
    }
  }

  /**
   * Delete a specific scan by code
   */
  deleteScan(code: string): void {
    const scans = this.loadScans();
    const filtered = scans.filter(scan => scan.code !== code);

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting scan from localStorage:', error);
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
