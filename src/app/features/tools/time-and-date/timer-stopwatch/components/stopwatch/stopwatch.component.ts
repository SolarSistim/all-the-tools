import { Component, OnInit, OnDestroy, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { StopwatchLap, StopwatchState } from '../../models/timer-stopwatch.models';
import { StopwatchStorageService } from '../../services/stopwatch-storage.service';
import { CustomSnackbarService } from '../../../../../../core/services/custom-snackbar.service';
import { ConfirmDialogComponent } from '../../../../social-media/social-launchpad/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-stopwatch',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule
  ],
  templateUrl: './stopwatch.component.html',
  styleUrl: './stopwatch.component.scss'
})
export class StopwatchComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private storageService = inject(StopwatchStorageService);
  private snackbar = inject(CustomSnackbarService);
  private dialog = inject(MatDialog);

  private animationFrameId?: number;
  private startTimestamp: number = 0;
  private lapStartTimestamp: number = 0;
  private audioContext?: AudioContext;

  // Stopwatch state
  stopwatchState = signal<StopwatchState>({
    elapsedMs: 0,
    isRunning: false,
    isPaused: false,
    lapStartMs: 0
  });

  // Laps
  laps = signal<StopwatchLap[]>([]);
  editingLapId = signal<string | null>(null);
  editingNote = signal<string>('');

  // Computed display values
  displayTime = computed(() => {
    const ms = this.stopwatchState().elapsedMs;
    return this.formatTime(ms);
  });

  currentLapTime = computed(() => {
    const state = this.stopwatchState();
    const lapMs = state.elapsedMs - state.lapStartMs;
    return this.formatTime(lapMs);
  });

  isRunning = computed(() => this.stopwatchState().isRunning);
  isPaused = computed(() => this.stopwatchState().isPaused);
  hasLaps = computed(() => this.laps().length > 0);

  // Table columns
  displayedColumns: string[] = ['lapNumber', 'lapTime', 'totalTime', 'note', 'actions'];

  ngOnInit(): void {
    // Load saved laps from storage
    this.laps.set(this.storageService.loadLaps());
  }

  ngOnDestroy(): void {
    this.stopAnimation();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }

  // ============================================
  // STOPWATCH CONTROLS
  // ============================================

  startStopwatch(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const state = this.stopwatchState();

    if (state.isPaused) {
      // Resume from paused state
      this.startTimestamp = performance.now() - state.elapsedMs;
      this.lapStartTimestamp = performance.now() - (state.elapsedMs - state.lapStartMs);
    } else {
      // Fresh start
      this.startTimestamp = performance.now();
      this.lapStartTimestamp = performance.now();
    }

    this.stopwatchState.update(s => ({
      ...s,
      isRunning: true,
      isPaused: false
    }));

    this.startAnimation();
  }

  pauseStopwatch(): void {
    this.stopAnimation();
    this.stopwatchState.update(s => ({
      ...s,
      isRunning: false,
      isPaused: true
    }));
  }

  resetStopwatch(): void {
    this.stopAnimation();
    this.stopwatchState.set({
      elapsedMs: 0,
      isRunning: false,
      isPaused: false,
      lapStartMs: 0
    });
    this.startTimestamp = 0;
    this.lapStartTimestamp = 0;
  }

  recordLap(): void {
    if (!this.isRunning()) return;

    const state = this.stopwatchState();
    const lapTime = state.elapsedMs - state.lapStartMs;
    const lapNumber = this.laps().length + 1;

    // Play lap beep
    this.playLapBeep();

    // Save lap
    const newLap = this.storageService.saveLap({
      lapNumber,
      lapTime,
      totalTime: state.elapsedMs
    });

    if (newLap) {
      this.laps.update(laps => [...laps, newLap]);

      // Update lap start time
      this.lapStartTimestamp = performance.now();
      this.stopwatchState.update(s => ({
        ...s,
        lapStartMs: s.elapsedMs
      }));

      this.snackbar.success(`Lap ${lapNumber} recorded`, 1500);
    }
  }

  // ============================================
  // LAP MANAGEMENT
  // ============================================

  startEditingNote(lap: StopwatchLap): void {
    this.editingLapId.set(lap.id);
    this.editingNote.set(lap.note || '');
  }

  saveNote(lap: StopwatchLap): void {
    const note = this.editingNote().trim();

    if (this.storageService.updateLap(lap.id, { note })) {
      this.laps.update(laps =>
        laps.map(l => l.id === lap.id ? { ...l, note } : l)
      );
      this.snackbar.success('Note saved', 1500);
    }

    this.editingLapId.set(null);
    this.editingNote.set('');
  }

  cancelEditing(): void {
    this.editingLapId.set(null);
    this.editingNote.set('');
  }

  deleteLap(lap: StopwatchLap): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Lap',
        message: `Are you sure you want to delete Lap ${lap.lapNumber}?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        icon: 'delete'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.storageService.deleteLap(lap.id)) {
          // Reload laps (they get renumbered by the service)
          this.laps.set(this.storageService.loadLaps());
          this.snackbar.success('Lap deleted', 1500);
        }
      }
    });
  }

  clearAllLaps(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Clear All Laps',
        message: `Are you sure you want to delete all ${this.laps().length} lap(s)? This action cannot be undone.`,
        confirmText: 'Clear All',
        cancelText: 'Cancel',
        icon: 'delete_sweep'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.storageService.clearLaps();
        this.laps.set([]);
        this.snackbar.success('All laps cleared', 2000);
      }
    });
  }

  // ============================================
  // ANIMATION
  // ============================================

  private startAnimation(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const animate = () => {
      const now = performance.now();
      const elapsed = now - this.startTimestamp;

      this.stopwatchState.update(s => ({
        ...s,
        elapsedMs: elapsed
      }));

      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  private stopAnimation(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
  }

  // ============================================
  // AUDIO
  // ============================================

  private playLapBeep(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      if (!this.audioContext) {
        this.audioContext = new AudioContext();
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = 1000; // High beep
      oscillator.type = 'sine';

      const now = this.audioContext.currentTime;
      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

      oscillator.start(now);
      oscillator.stop(now + 0.1);
    } catch (e) {
      console.error('Error playing lap beep:', e);
    }
  }

  // ============================================
  // UTILITIES
  // ============================================

  formatTime(ms: number): { hours: string; minutes: string; seconds: string; centiseconds: string } {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      centiseconds: centiseconds.toString().padStart(2, '0')
    };
  }

  formatTimeString(ms: number): string {
    const time = this.formatTime(ms);
    if (parseInt(time.hours) > 0) {
      return `${time.hours}:${time.minutes}:${time.seconds}.${time.centiseconds}`;
    }
    return `${time.minutes}:${time.seconds}.${time.centiseconds}`;
  }
}
