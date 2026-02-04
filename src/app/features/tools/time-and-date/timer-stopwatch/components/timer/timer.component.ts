import { Component, OnInit, OnDestroy, inject, signal, computed, PLATFORM_ID, output } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { TimerPreset, TimerState } from '../../models/timer-stopwatch.models';
import { TimerStorageService } from '../../services/timer-storage.service';
import { CustomSnackbarService } from '../../../../../../core/services/custom-snackbar.service';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss'
})
export class TimerComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private storageService = inject(TimerStorageService);
  private snackbar = inject(CustomSnackbarService);
  private dialog = inject(MatDialog);

  private intervalId?: number;
  private audioContext?: AudioContext;

  // Timer completed event
  timerCompleted = output<void>();

  // Input values for setting time
  hoursInput = signal<number>(0);
  minutesInput = signal<number>(0);
  secondsInput = signal<number>(0);

  // Timer state
  timerState = signal<TimerState>({
    totalSeconds: 0,
    remainingSeconds: 0,
    isRunning: false,
    isPaused: false
  });

  // Presets
  presets = signal<TimerPreset[]>([]);

  // New preset form
  showPresetForm = signal<boolean>(false);
  newPresetName = signal<string>('');

  // Computed values
  displayHours = computed(() => Math.floor(this.timerState().remainingSeconds / 3600));
  displayMinutes = computed(() => Math.floor((this.timerState().remainingSeconds % 3600) / 60));
  displaySeconds = computed(() => this.timerState().remainingSeconds % 60);

  isRunning = computed(() => this.timerState().isRunning);
  isPaused = computed(() => this.timerState().isPaused);
  isComplete = computed(() =>
    this.timerState().totalSeconds > 0 &&
    this.timerState().remainingSeconds <= 0 &&
    !this.timerState().isRunning
  );

  canStart = computed(() => {
    const state = this.timerState();
    const hasTime = this.hoursInput() > 0 || this.minutesInput() > 0 || this.secondsInput() > 0;
    const hasRemaining = state.remainingSeconds > 0;
    return (hasTime || hasRemaining) && !state.isRunning;
  });

  // Progress percentage (0-100)
  progressPercent = computed(() => {
    const state = this.timerState();
    if (state.totalSeconds === 0) return 100;
    return (state.remainingSeconds / state.totalSeconds) * 100;
  });

  // SVG circle values for progress ring
  circumference = 2 * Math.PI * 120; // radius = 120

  ngOnInit(): void {
    this.presets.set(this.storageService.loadPresets());
  }

  ngOnDestroy(): void {
    this.stopInterval();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }

  // ============================================
  // TIME INPUT METHODS
  // ============================================

  incrementHours(): void {
    if (!this.isRunning()) {
      this.hoursInput.update(v => Math.min(v + 1, 99));
    }
  }

  decrementHours(): void {
    if (!this.isRunning()) {
      this.hoursInput.update(v => Math.max(v - 1, 0));
    }
  }

  incrementMinutes(): void {
    if (!this.isRunning()) {
      this.minutesInput.update(v => {
        if (v >= 59) {
          this.incrementHours();
          return 0;
        }
        return v + 1;
      });
    }
  }

  decrementMinutes(): void {
    if (!this.isRunning()) {
      this.minutesInput.update(v => Math.max(v - 1, 0));
    }
  }

  incrementSeconds(): void {
    if (!this.isRunning()) {
      this.secondsInput.update(v => {
        if (v >= 59) {
          this.incrementMinutes();
          return 0;
        }
        return v + 1;
      });
    }
  }

  decrementSeconds(): void {
    if (!this.isRunning()) {
      this.secondsInput.update(v => Math.max(v - 1, 0));
    }
  }

  onHoursChange(value: string): void {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      this.hoursInput.set(Math.max(0, Math.min(num, 99)));
    }
  }

  onMinutesChange(value: string): void {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      this.minutesInput.set(Math.max(0, Math.min(num, 59)));
    }
  }

  onSecondsChange(value: string): void {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      this.secondsInput.set(Math.max(0, Math.min(num, 59)));
    }
  }

  // ============================================
  // TIMER CONTROLS
  // ============================================

  startTimer(): void {
    const state = this.timerState();

    // If paused, resume from remaining time
    if (state.isPaused && state.remainingSeconds > 0) {
      this.timerState.update(s => ({
        ...s,
        isRunning: true,
        isPaused: false
      }));
      this.startInterval();
      return;
    }

    // Calculate total seconds from inputs
    const totalSeconds =
      this.hoursInput() * 3600 +
      this.minutesInput() * 60 +
      this.secondsInput();

    if (totalSeconds <= 0) {
      this.snackbar.error('Please set a time greater than 0', 2000);
      return;
    }

    this.timerState.set({
      totalSeconds,
      remainingSeconds: totalSeconds,
      isRunning: true,
      isPaused: false
    });

    this.startInterval();
  }

  pauseTimer(): void {
    this.stopInterval();
    this.timerState.update(s => ({
      ...s,
      isRunning: false,
      isPaused: true
    }));
  }

  resetTimer(): void {
    this.stopInterval();
    this.timerState.set({
      totalSeconds: 0,
      remainingSeconds: 0,
      isRunning: false,
      isPaused: false
    });
    this.hoursInput.set(0);
    this.minutesInput.set(0);
    this.secondsInput.set(0);
  }

  private startInterval(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.intervalId = window.setInterval(() => {
      this.timerState.update(state => {
        const newRemaining = state.remainingSeconds - 1;

        if (newRemaining <= 0) {
          this.stopInterval();
          this.onTimerComplete();
          return {
            ...state,
            remainingSeconds: 0,
            isRunning: false,
            isPaused: false
          };
        }

        return {
          ...state,
          remainingSeconds: newRemaining
        };
      });
    }, 1000);
  }

  private stopInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  private onTimerComplete(): void {
    this.playAlarm();
    this.timerCompleted.emit();
    this.snackbar.success('Timer complete!', 5000);
  }

  // ============================================
  // AUDIO
  // ============================================

  private playAlarm(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      if (!this.audioContext) {
        this.audioContext = new AudioContext();
      }

      const duration = 3; // 3 seconds of alarm
      const beepDuration = 0.15;
      const gapDuration = 0.15;
      const frequency = 880; // A5 note

      let currentTime = this.audioContext.currentTime;
      const endTime = currentTime + duration;

      while (currentTime < endTime) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + beepDuration);

        oscillator.start(currentTime);
        oscillator.stop(currentTime + beepDuration);

        currentTime += beepDuration + gapDuration;
      }
    } catch (e) {
      console.error('Error playing alarm:', e);
    }
  }

  // ============================================
  // PRESETS
  // ============================================

  selectPreset(preset: TimerPreset): void {
    if (this.isRunning()) return;

    this.hoursInput.set(preset.hours);
    this.minutesInput.set(preset.minutes);
    this.secondsInput.set(preset.seconds);

    // Reset timer state when selecting preset
    this.timerState.set({
      totalSeconds: 0,
      remainingSeconds: 0,
      isRunning: false,
      isPaused: false
    });
  }

  togglePresetForm(): void {
    this.showPresetForm.update(v => !v);
    if (!this.showPresetForm()) {
      this.newPresetName.set('');
    }
  }

  saveNewPreset(): void {
    const name = this.newPresetName().trim();
    if (!name) {
      this.snackbar.error('Please enter a preset name', 2000);
      return;
    }

    const hours = this.hoursInput();
    const minutes = this.minutesInput();
    const seconds = this.secondsInput();

    if (hours === 0 && minutes === 0 && seconds === 0) {
      this.snackbar.error('Please set a time before saving', 2000);
      return;
    }

    const saved = this.storageService.savePreset({
      name,
      hours,
      minutes,
      seconds
    });

    if (saved) {
      this.presets.set(this.storageService.loadPresets());
      this.showPresetForm.set(false);
      this.newPresetName.set('');
      this.snackbar.success('Preset saved!', 2000);
    } else {
      this.snackbar.error('Failed to save preset', 2000);
    }
  }

  deletePreset(preset: TimerPreset, event: Event): void {
    event.stopPropagation();

    if (preset.isDefault) {
      this.snackbar.error('Cannot delete default presets', 2000);
      return;
    }

    if (this.storageService.deletePreset(preset.id)) {
      this.presets.set(this.storageService.loadPresets());
      this.snackbar.success('Preset deleted', 2000);
    }
  }

  // ============================================
  // UTILITIES
  // ============================================

  formatTime(hours: number, minutes: number, seconds: number): string {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  getPresetDisplayTime(preset: TimerPreset): string {
    const parts: string[] = [];
    if (preset.hours > 0) {
      parts.push(`${preset.hours}h`);
    }
    if (preset.minutes > 0) {
      parts.push(`${preset.minutes}m`);
    }
    if (preset.seconds > 0) {
      parts.push(`${preset.seconds}s`);
    }
    return parts.join(' ') || '0s';
  }
}
