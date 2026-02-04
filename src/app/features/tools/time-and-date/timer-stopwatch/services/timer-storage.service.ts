import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TimerPreset } from '../models/timer-stopwatch.models';

@Injectable({
  providedIn: 'root'
})
export class TimerStorageService {
  private readonly STORAGE_KEY = 'timer_presets';
  private platformId = inject(PLATFORM_ID);

  private readonly DEFAULT_PRESETS: TimerPreset[] = [
    {
      id: 'default-1min',
      name: '1 Minute',
      hours: 0,
      minutes: 1,
      seconds: 0,
      isDefault: true,
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'default-5min',
      name: '5 Minutes',
      hours: 0,
      minutes: 5,
      seconds: 0,
      isDefault: true,
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'default-10min',
      name: '10 Minutes',
      hours: 0,
      minutes: 10,
      seconds: 0,
      isDefault: true,
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'default-15min',
      name: '15 Minutes',
      hours: 0,
      minutes: 15,
      seconds: 0,
      isDefault: true,
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'default-20min',
      name: '20 Minutes',
      hours: 0,
      minutes: 20,
      seconds: 0,
      isDefault: true,
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'default-30min',
      name: '30 Minutes',
      hours: 0,
      minutes: 30,
      seconds: 0,
      isDefault: true,
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'default-1hr',
      name: '1 Hour',
      hours: 1,
      minutes: 0,
      seconds: 0,
      isDefault: true,
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'default-2hr',
      name: '2 Hours',
      hours: 2,
      minutes: 0,
      seconds: 0,
      isDefault: true,
      createdAt: '2024-01-01T00:00:00.000Z'
    }
  ];

  private getStorage(): Storage | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage;
    }
    return null;
  }

  /**
   * Load all presets (defaults + user-created)
   */
  loadPresets(): TimerPreset[] {
    const storage = this.getStorage();
    if (!storage) {
      return [...this.DEFAULT_PRESETS];
    }

    try {
      const stored = storage.getItem(this.STORAGE_KEY);
      if (stored) {
        const userPresets: TimerPreset[] = JSON.parse(stored);
        // Combine default presets with user presets
        return [...this.DEFAULT_PRESETS, ...userPresets];
      }
    } catch (e) {
      console.error('Error loading timer presets:', e);
    }

    return [...this.DEFAULT_PRESETS];
  }

  /**
   * Save a new user preset
   */
  savePreset(preset: Omit<TimerPreset, 'id' | 'createdAt' | 'isDefault'>): TimerPreset | null {
    const storage = this.getStorage();
    if (!storage) return null;

    const newPreset: TimerPreset = {
      ...preset,
      id: this.generateId(),
      isDefault: false,
      createdAt: new Date().toISOString()
    };

    try {
      const stored = storage.getItem(this.STORAGE_KEY);
      const userPresets: TimerPreset[] = stored ? JSON.parse(stored) : [];
      userPresets.push(newPreset);
      storage.setItem(this.STORAGE_KEY, JSON.stringify(userPresets));
      return newPreset;
    } catch (e) {
      console.error('Error saving timer preset:', e);
      return null;
    }
  }

  /**
   * Delete a user preset (cannot delete default presets)
   */
  deletePreset(id: string): boolean {
    const storage = this.getStorage();
    if (!storage) return false;

    // Check if it's a default preset
    if (this.DEFAULT_PRESETS.some(p => p.id === id)) {
      return false;
    }

    try {
      const stored = storage.getItem(this.STORAGE_KEY);
      if (stored) {
        const userPresets: TimerPreset[] = JSON.parse(stored);
        const filtered = userPresets.filter(p => p.id !== id);
        storage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
        return true;
      }
    } catch (e) {
      console.error('Error deleting timer preset:', e);
    }

    return false;
  }

  /**
   * Clear all user presets (keeps defaults)
   */
  clearUserPresets(): void {
    const storage = this.getStorage();
    if (storage) {
      storage.removeItem(this.STORAGE_KEY);
    }
  }

  /**
   * Get default presets only
   */
  getDefaultPresets(): TimerPreset[] {
    return [...this.DEFAULT_PRESETS];
  }

  private generateId(): string {
    return 'preset-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
  }
}
