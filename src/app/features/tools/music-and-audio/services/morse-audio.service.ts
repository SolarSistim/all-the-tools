import { Injectable } from '@angular/core';

export interface PlaybackSettings {
  wpm: number;
  frequency: number;
  volume: number;
}

@Injectable({
  providedIn: 'root'
})
export class MorseAudioService {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private scheduledSources: OscillatorNode[] = [];
  private stopTime = 0;

  constructor() {}

  private initAudioContext(): void {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
    }
  }

  playMorse(morse: string, settings: PlaybackSettings): void {
    this.initAudioContext();

    if (!this.audioContext || !this.gainNode) {
      console.error('Audio context not initialized');
      return;
    }

    this.stop();

    const dotDuration = 1.2 / settings.wpm;
    const dashDuration = dotDuration * 3;
    const intraDuration = dotDuration;
    const letterGapDuration = dotDuration * 3;
    const wordGapDuration = dotDuration * 7;

    this.gainNode.gain.value = settings.volume;

    let currentTime = this.audioContext.currentTime + 0.05;
    this.isPlaying = true;

    const words = morse.split(' / ');

    for (let w = 0; w < words.length; w++) {
      const letters = words[w].split(' ');

      for (let l = 0; l < letters.length; l++) {
        const letter = letters[l];

        for (let i = 0; i < letter.length; i++) {
          const symbol = letter[i];

          const oscillator = this.audioContext.createOscillator();
          oscillator.connect(this.gainNode);
          oscillator.frequency.value = settings.frequency;
          oscillator.type = 'sine';

          this.scheduledSources.push(oscillator);

          if (symbol === '.') {
            oscillator.start(currentTime);
            oscillator.stop(currentTime + dotDuration);
            currentTime += dotDuration + intraDuration;
          } else if (symbol === '-') {
            oscillator.start(currentTime);
            oscillator.stop(currentTime + dashDuration);
            currentTime += dashDuration + intraDuration;
          }
        }

        if (l < letters.length - 1) {
          currentTime += letterGapDuration - intraDuration;
        }
      }

      if (w < words.length - 1) {
        currentTime += wordGapDuration - intraDuration;
      }
    }

    this.stopTime = currentTime;

    setTimeout(() => {
      this.isPlaying = false;
      this.scheduledSources = [];
    }, (currentTime - this.audioContext.currentTime) * 1000);
  }

  stop(): void {
    this.isPlaying = false;

    this.scheduledSources.forEach(source => {
      try {
        source.stop();
        source.disconnect();
      } catch (e) {
      }
    });

    this.scheduledSources = [];
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  destroy(): void {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      this.gainNode = null;
    }
  }
}
