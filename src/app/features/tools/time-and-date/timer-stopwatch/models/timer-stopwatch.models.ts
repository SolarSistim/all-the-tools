/**
 * Timer preset configuration
 */
export interface TimerPreset {
  id: string;
  name: string;
  hours: number;
  minutes: number;
  seconds: number;
  isDefault: boolean;
  createdAt: string;
}

/**
 * Stopwatch lap record
 */
export interface StopwatchLap {
  id: string;
  lapNumber: number;
  lapTime: number;       // Duration of this lap in milliseconds
  totalTime: number;     // Total elapsed time at lap end in milliseconds
  note?: string;         // Optional user note
  createdAt: string;
}

/**
 * Timer/Stopwatch mode type
 */
export type TimerStopwatchMode = 'timer' | 'stopwatch';

/**
 * Timer state for internal tracking
 */
export interface TimerState {
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
}

/**
 * Stopwatch state for internal tracking
 */
export interface StopwatchState {
  elapsedMs: number;
  isRunning: boolean;
  isPaused: boolean;
  lapStartMs: number;    // Start time of current lap
}
