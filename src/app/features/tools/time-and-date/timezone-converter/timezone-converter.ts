import { Component, inject, signal, computed, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MetaService } from '../../../../core/services/meta.service';

interface TimezoneDisplay {
  id: string;
  timezone: string;
  label: string;
  offset: string;
  isPrimary?: boolean;
}

interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
  region: string;
}

@Component({
  selector: 'app-timezone-converter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatSelectModule
  ],
  templateUrl: './timezone-converter.html',
  styleUrl: './timezone-converter.scss',
})
export class TimezoneConverter implements OnInit, OnDestroy {
  private metaService = inject(MetaService);
  private snackBar = inject(MatSnackBar);
  private platformId = inject(PLATFORM_ID);
  private intervalId?: number;

  // Current time (updates every second)
  currentTime = signal<Date>(new Date());

  // User's timezone
  userTimezone = signal<string>(Intl.DateTimeFormat().resolvedOptions().timeZone);
  
  // Selected timezone for adding
  selectedTimezoneToAdd = signal<string>('');

  // Active timezone displays
  activeTimezones = signal<TimezoneDisplay[]>([
    {
      id: 'user',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      label: 'Your Timezone',
      offset: this.getTimezoneOffset(new Date(), Intl.DateTimeFormat().resolvedOptions().timeZone),
      isPrimary: true
    }
  ]);

  // All available timezones grouped by region
  timezonesByRegion: { [key: string]: TimezoneOption[] } = {
    'North America': [
      { value: 'America/New_York', label: 'New York', offset: 'UTC-5', region: 'North America' },
      { value: 'America/Chicago', label: 'Chicago', offset: 'UTC-6', region: 'North America' },
      { value: 'America/Denver', label: 'Denver', offset: 'UTC-7', region: 'North America' },
      { value: 'America/Los_Angeles', label: 'Los Angeles', offset: 'UTC-8', region: 'North America' },
      { value: 'America/Phoenix', label: 'Phoenix', offset: 'UTC-7', region: 'North America' },
      { value: 'America/Anchorage', label: 'Anchorage', offset: 'UTC-9', region: 'North America' },
      { value: 'America/Toronto', label: 'Toronto', offset: 'UTC-5', region: 'North America' },
      { value: 'America/Vancouver', label: 'Vancouver', offset: 'UTC-8', region: 'North America' },
      { value: 'America/Mexico_City', label: 'Mexico City', offset: 'UTC-6', region: 'North America' },
    ],
    'South America': [
      { value: 'America/Sao_Paulo', label: 'São Paulo', offset: 'UTC-3', region: 'South America' },
      { value: 'America/Buenos_Aires', label: 'Buenos Aires', offset: 'UTC-3', region: 'South America' },
      { value: 'America/Santiago', label: 'Santiago', offset: 'UTC-3', region: 'South America' },
      { value: 'America/Lima', label: 'Lima', offset: 'UTC-5', region: 'South America' },
      { value: 'America/Bogota', label: 'Bogotá', offset: 'UTC-5', region: 'South America' },
    ],
    'Europe': [
      { value: 'Europe/London', label: 'London', offset: 'UTC+0', region: 'Europe' },
      { value: 'Europe/Paris', label: 'Paris', offset: 'UTC+1', region: 'Europe' },
      { value: 'Europe/Berlin', label: 'Berlin', offset: 'UTC+1', region: 'Europe' },
      { value: 'Europe/Madrid', label: 'Madrid', offset: 'UTC+1', region: 'Europe' },
      { value: 'Europe/Rome', label: 'Rome', offset: 'UTC+1', region: 'Europe' },
      { value: 'Europe/Amsterdam', label: 'Amsterdam', offset: 'UTC+1', region: 'Europe' },
      { value: 'Europe/Stockholm', label: 'Stockholm', offset: 'UTC+1', region: 'Europe' },
      { value: 'Europe/Athens', label: 'Athens', offset: 'UTC+2', region: 'Europe' },
      { value: 'Europe/Moscow', label: 'Moscow', offset: 'UTC+3', region: 'Europe' },
      { value: 'Europe/Istanbul', label: 'Istanbul', offset: 'UTC+3', region: 'Europe' },
    ],
    'Asia': [
      { value: 'Asia/Dubai', label: 'Dubai', offset: 'UTC+4', region: 'Asia' },
      { value: 'Asia/Kolkata', label: 'Mumbai/Delhi', offset: 'UTC+5:30', region: 'Asia' },
      { value: 'Asia/Shanghai', label: 'Shanghai', offset: 'UTC+8', region: 'Asia' },
      { value: 'Asia/Hong_Kong', label: 'Hong Kong', offset: 'UTC+8', region: 'Asia' },
      { value: 'Asia/Singapore', label: 'Singapore', offset: 'UTC+8', region: 'Asia' },
      { value: 'Asia/Tokyo', label: 'Tokyo', offset: 'UTC+9', region: 'Asia' },
      { value: 'Asia/Seoul', label: 'Seoul', offset: 'UTC+9', region: 'Asia' },
      { value: 'Asia/Bangkok', label: 'Bangkok', offset: 'UTC+7', region: 'Asia' },
      { value: 'Asia/Jakarta', label: 'Jakarta', offset: 'UTC+7', region: 'Asia' },
    ],
    'Africa & Middle East': [
      { value: 'Africa/Cairo', label: 'Cairo', offset: 'UTC+2', region: 'Africa & Middle East' },
      { value: 'Africa/Johannesburg', label: 'Johannesburg', offset: 'UTC+2', region: 'Africa & Middle East' },
      { value: 'Africa/Lagos', label: 'Lagos', offset: 'UTC+1', region: 'Africa & Middle East' },
      { value: 'Africa/Nairobi', label: 'Nairobi', offset: 'UTC+3', region: 'Africa & Middle East' },
    ],
    'Pacific': [
      { value: 'Australia/Sydney', label: 'Sydney', offset: 'UTC+11', region: 'Pacific' },
      { value: 'Australia/Melbourne', label: 'Melbourne', offset: 'UTC+11', region: 'Pacific' },
      { value: 'Australia/Brisbane', label: 'Brisbane', offset: 'UTC+10', region: 'Pacific' },
      { value: 'Australia/Perth', label: 'Perth', offset: 'UTC+8', region: 'Pacific' },
      { value: 'Pacific/Auckland', label: 'Auckland', offset: 'UTC+13', region: 'Pacific' },
      { value: 'Pacific/Fiji', label: 'Fiji', offset: 'UTC+12', region: 'Pacific' },
      { value: 'Pacific/Honolulu', label: 'Honolulu', offset: 'UTC-10', region: 'Pacific' },
    ],
    'Other': [
      { value: 'UTC', label: 'UTC', offset: 'UTC+0', region: 'Other' },
      { value: 'Etc/GMT+12', label: 'GMT-12', offset: 'UTC-12', region: 'Other' },
      { value: 'Etc/GMT+11', label: 'GMT-11', offset: 'UTC-11', region: 'Other' },
    ]
  };

  // Flattened list for dropdown
  allTimezones = computed<TimezoneOption[]>(() => {
    return Object.values(this.timezonesByRegion).flat();
  });

  // Time displays for each active timezone
  timezoneDisplays = computed(() => {
    const currentTime = this.currentTime();
    return this.activeTimezones().map(tz => ({
      ...tz,
      time: this.formatTimeForTimezone(currentTime, tz.timezone),
      date: this.formatDateForTimezone(currentTime, tz.timezone),
      timeWithSeconds: this.formatTimeWithSecondsForTimezone(currentTime, tz.timezone),
      offset: this.getTimezoneOffset(currentTime, tz.timezone),
      offsetMinutes: this.getOffsetInMinutes(currentTime, tz.timezone),
    }));
  });

  // User timezone display (always first)
  userTimezoneDisplay = computed(() => {
    const displays = this.timezoneDisplays();
    return displays.find(d => d.isPrimary) || displays[0];
  });

  // Other timezone displays
  otherTimezoneDisplays = computed(() => {
    return this.timezoneDisplays().filter(d => !d.isPrimary);
  });

  constructor() {
    // Update current time every second (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      this.intervalId = window.setInterval(() => {
        this.currentTime.set(new Date());
      }, 1000);
    }
  }

  ngOnInit(): void {
    this.metaService.updateTags({
      title: 'Timezone Converter - World Clock & Time Zone Comparison',
      description: 'Compare time zones across the world with live clocks. View time differences, schedule meetings, and convert times between multiple time zones instantly.',
      keywords: ['timezone converter', 'world clock', 'time zone comparison', 'international time', 'time difference calculator', 'meeting scheduler', 'timezone calculator'],
      image: 'https://www.allthethings.dev/meta-images/og-timezone-converter.png',
      url: 'https://www.allthethings.dev/tools/timezone-converter'
    });

    // Load saved timezones from local storage, or add popular ones if none saved
    if (!this.loadSavedTimezones()) {
      this.addPopularTimezones();
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // ============================================
  // TIME FORMATTING
  // ============================================

  /**
   * Format time for a specific timezone (HH:MM AM/PM)
   */
  formatTimeForTimezone(date: Date, timezone: string): string {
    try {
      return date.toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  }

  /**
   * Format time with seconds for a specific timezone
   */
  formatTimeWithSecondsForTimezone(date: Date, timezone: string): string {
    try {
      return date.toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    }
  }

  /**
   * Format date for a specific timezone
   */
  formatDateForTimezone(date: Date, timezone: string): string {
    try {
      return date.toLocaleDateString('en-US', {
        timeZone: timezone,
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
  }

  /**
   * Get timezone offset string (e.g., "UTC+5:30")
   */
  getTimezoneOffset(date: Date, timezone: string): string {
    try {
      const offsetMinutes = this.getOffsetInMinutes(date, timezone);
      const hours = Math.floor(Math.abs(offsetMinutes) / 60);
      const minutes = Math.abs(offsetMinutes) % 60;
      const sign = offsetMinutes >= 0 ? '+' : '-';
      
      if (minutes === 0) {
        return `UTC${sign}${hours}`;
      } else {
        return `UTC${sign}${hours}:${minutes.toString().padStart(2, '0')}`;
      }
    } catch {
      return 'UTC';
    }
  }

  /**
   * Get offset in minutes from UTC
   */
  getOffsetInMinutes(date: Date, timezone: string): number {
    try {
      // Get the date string in the target timezone
      const tzString = date.toLocaleString('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      // Get the date string in UTC
      const utcString = date.toLocaleString('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      // Parse both strings as dates
      const tzDate = new Date(tzString);
      const utcDate = new Date(utcString);

      // Calculate offset: timezone time - UTC time
      const offset = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60);
      return Math.round(offset);
    } catch {
      return 0;
    }
  }

  /**
   * Calculate time difference between two timezones
   */
  getTimeDifference(timezone1: string, timezone2: string): string {
    const date = new Date();
    const offset1 = this.getOffsetInMinutes(date, timezone1);
    const offset2 = this.getOffsetInMinutes(date, timezone2);
    const diff = offset2 - offset1;
    
    const hours = Math.floor(Math.abs(diff) / 60);
    const minutes = Math.abs(diff) % 60;
    
    if (diff === 0) {
      return 'Same time';
    }
    
    const ahead = diff > 0 ? 'ahead' : 'behind';
    
    if (minutes === 0) {
      return `${hours}h ${ahead}`;
    } else {
      return `${hours}h ${minutes}m ${ahead}`;
    }
  }

  // ============================================
  // TIMEZONE MANAGEMENT
  // ============================================

  /**
   * Add popular timezones by default
   */
  addPopularTimezones(): void {
    const popularTimezones = [
      'America/New_York',
      'Europe/London',
      'Asia/Tokyo',
    ];

    popularTimezones.forEach(tz => {
      if (tz !== this.userTimezone()) {
        const tzOption = this.allTimezones().find(t => t.value === tz);
        if (tzOption) {
          this.addTimezoneDisplay(tzOption);
        }
      }
    });

    // Save the default timezones
    this.saveTimezonesToStorage();
  }

  /**
   * Save timezones to local storage
   */
  private saveTimezonesToStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      // Only save non-primary timezones
      const timezonesToSave = this.activeTimezones()
        .filter(tz => !tz.isPrimary)
        .map(tz => ({
          timezone: tz.timezone,
          label: tz.label,
          offset: tz.offset
        }));

      localStorage.setItem('savedTimezones', JSON.stringify(timezonesToSave));
    } catch (error) {
      console.error('Failed to save timezones to local storage', error);
    }
  }

  /**
   * Load timezones from local storage
   * Returns true if timezones were loaded, false otherwise
   */
  private loadSavedTimezones(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;

    try {
      const saved = localStorage.getItem('savedTimezones');
      if (!saved) return false;

      const savedTimezones = JSON.parse(saved);
      if (!Array.isArray(savedTimezones) || savedTimezones.length === 0) return false;

      // Add saved timezones
      savedTimezones.forEach((tz: any) => {
        const tzOption = this.allTimezones().find(t => t.value === tz.timezone);
        if (tzOption) {
          this.addTimezoneDisplay(tzOption);
        }
      });

      return true;
    } catch (error) {
      console.error('Failed to load timezones from local storage', error);
      return false;
    }
  }

  /**
   * Add a timezone to the active list
   */
  addTimezone(): void {
    const selected = this.selectedTimezoneToAdd();
    if (!selected) {
      this.snackBar.open('Please select a timezone', 'Close', { duration: 2000 });
      return;
    }

    const tzOption = this.allTimezones().find(t => t.value === selected);
    if (!tzOption) return;

    // Check if already added to World Clocks (exclude primary timezone)
    if (this.activeTimezones().some(t => t.timezone === selected && !t.isPrimary)) {
      this.snackBar.open('This timezone is already added', 'Close', { duration: 2000 });
      return;
    }

    this.addTimezoneDisplay(tzOption);
    this.selectedTimezoneToAdd.set('');
    this.saveTimezonesToStorage();
    this.snackBar.open('Timezone added!', 'Close', { duration: 2000 });
  }

  /**
   * Add a timezone display
   */
  private addTimezoneDisplay(tzOption: TimezoneOption): void {
    const newTimezone: TimezoneDisplay = {
      id: `tz-${Date.now()}-${Math.random()}`,
      timezone: tzOption.value,
      label: tzOption.label,
      offset: tzOption.offset,
      isPrimary: false
    };

    this.activeTimezones.update(zones => [...zones, newTimezone]);
  }

  /**
   * Remove a timezone from the active list
   */
  removeTimezone(id: string): void {
    const timezone = this.activeTimezones().find(t => t.id === id);
    if (timezone?.isPrimary) {
      this.snackBar.open('Cannot remove your primary timezone', 'Close', { duration: 2000 });
      return;
    }

    this.activeTimezones.update(zones => zones.filter(t => t.id !== id));
    this.saveTimezonesToStorage();
    this.snackBar.open('Timezone removed', 'Close', { duration: 2000 });
  }

  /**
   * Clear all non-primary timezones
   */
  clearAllTimezones(): void {
    this.activeTimezones.update(zones => zones.filter(t => t.isPrimary));
    this.saveTimezonesToStorage();
    this.snackBar.open('All timezones cleared', 'Close', { duration: 2000 });
  }

  // ============================================
  // COPY FUNCTIONS
  // ============================================

  /**
   * Copy timezone time to clipboard
   */
  async copyTimezoneTime(timezone: string, label: string): Promise<void> {
    const time = this.formatTimeForTimezone(this.currentTime(), timezone);
    const date = this.formatDateForTimezone(this.currentTime(), timezone);
    const text = `${label}: ${time} - ${date}`;
    
    try {
      await navigator.clipboard.writeText(text);
      this.snackBar.open('Time copied to clipboard!', 'Close', { duration: 2000 });
    } catch {
      this.snackBar.open('Failed to copy to clipboard', 'Close', { duration: 2000 });
    }
  }

  /**
   * Copy all timezone times
   */
  async copyAllTimes(): Promise<void> {
    const displays = this.timezoneDisplays();
    const text = displays.map(d => {
      return `${d.label}: ${d.time} (${d.offset}) - ${d.date}`;
    }).join('\n');
    
    try {
      await navigator.clipboard.writeText(text);
      this.snackBar.open('All times copied to clipboard!', 'Close', { duration: 2000 });
    } catch {
      this.snackBar.open('Failed to copy to clipboard', 'Close', { duration: 2000 });
    }
  }

  // ============================================
  // UI HELPERS
  // ============================================

  /**
   * Scroll to timezone clocks section
   */
  scrollToClocks(): void {
    const element = document.querySelector('.add-timezone-card');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * Get regions for grouping
   */
  getRegions(): string[] {
    return Object.keys(this.timezonesByRegion);
  }

  /**
   * Get timezones for a region
   */
  getTimezonesForRegion(region: string): TimezoneOption[] {
    return this.timezonesByRegion[region] || [];
  }

  /**
   * Track by function for ngFor
   */
  trackByTimezoneId(index: number, item: any): string {
    return item.id;
  }
}