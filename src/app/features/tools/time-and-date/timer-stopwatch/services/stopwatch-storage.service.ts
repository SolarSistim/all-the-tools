import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StopwatchLap } from '../models/timer-stopwatch.models';

@Injectable({
  providedIn: 'root'
})
export class StopwatchStorageService {
  private readonly STORAGE_KEY = 'stopwatch_laps';
  private platformId = inject(PLATFORM_ID);

  private getStorage(): Storage | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage;
    }
    return null;
  }

  /**
   * Load all saved laps
   */
  loadLaps(): StopwatchLap[] {
    const storage = this.getStorage();
    if (!storage) return [];

    try {
      const stored = storage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading stopwatch laps:', e);
    }

    return [];
  }

  /**
   * Save a new lap
   */
  saveLap(lap: Omit<StopwatchLap, 'id' | 'createdAt'>): StopwatchLap | null {
    const storage = this.getStorage();
    if (!storage) return null;

    const newLap: StopwatchLap = {
      ...lap,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    };

    try {
      const laps = this.loadLaps();
      laps.push(newLap);
      storage.setItem(this.STORAGE_KEY, JSON.stringify(laps));
      return newLap;
    } catch (e) {
      console.error('Error saving stopwatch lap:', e);
      return null;
    }
  }

  /**
   * Update an existing lap (e.g., edit note)
   */
  updateLap(id: string, updates: Partial<Pick<StopwatchLap, 'note'>>): boolean {
    const storage = this.getStorage();
    if (!storage) return false;

    try {
      const laps = this.loadLaps();
      const index = laps.findIndex(l => l.id === id);
      if (index !== -1) {
        laps[index] = { ...laps[index], ...updates };
        storage.setItem(this.STORAGE_KEY, JSON.stringify(laps));
        return true;
      }
    } catch (e) {
      console.error('Error updating stopwatch lap:', e);
    }

    return false;
  }

  /**
   * Delete a specific lap
   */
  deleteLap(id: string): boolean {
    const storage = this.getStorage();
    if (!storage) return false;

    try {
      const laps = this.loadLaps();
      const filtered = laps.filter(l => l.id !== id);

      // Renumber remaining laps
      filtered.forEach((lap, index) => {
        lap.lapNumber = index + 1;
      });

      storage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error('Error deleting stopwatch lap:', e);
    }

    return false;
  }

  /**
   * Clear all laps
   */
  clearLaps(): void {
    const storage = this.getStorage();
    if (storage) {
      storage.removeItem(this.STORAGE_KEY);
    }
  }

  /**
   * Save multiple laps at once (bulk save)
   */
  saveLaps(laps: StopwatchLap[]): boolean {
    const storage = this.getStorage();
    if (!storage) return false;

    try {
      storage.setItem(this.STORAGE_KEY, JSON.stringify(laps));
      return true;
    } catch (e) {
      console.error('Error saving stopwatch laps:', e);
      return false;
    }
  }

  private generateId(): string {
    return 'lap-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
  }
}
