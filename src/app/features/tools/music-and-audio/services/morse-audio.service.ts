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

  async generateMorseAudioBuffer(morse: string, settings: PlaybackSettings): Promise<AudioBuffer> {
    const dotDuration = 1.2 / settings.wpm;
    const dashDuration = dotDuration * 3;
    const intraDuration = dotDuration;
    const letterGapDuration = dotDuration * 3;
    const wordGapDuration = dotDuration * 7;

    let totalDuration = 0;
    const words = morse.split(' / ');

    for (let w = 0; w < words.length; w++) {
      const letters = words[w].split(' ');

      for (let l = 0; l < letters.length; l++) {
        const letter = letters[l];

        for (let i = 0; i < letter.length; i++) {
          const symbol = letter[i];

          if (symbol === '.') {
            totalDuration += dotDuration + intraDuration;
          } else if (symbol === '-') {
            totalDuration += dashDuration + intraDuration;
          }
        }

        if (l < letters.length - 1) {
          totalDuration += letterGapDuration - intraDuration;
        }
      }

      if (w < words.length - 1) {
        totalDuration += wordGapDuration - intraDuration;
      }
    }

    const sampleRate = 44100;
    const offlineContext = new OfflineAudioContext(1, Math.ceil(totalDuration * sampleRate), sampleRate);
    const gainNode = offlineContext.createGain();
    gainNode.gain.value = settings.volume;
    gainNode.connect(offlineContext.destination);

    let currentTime = 0;

    for (let w = 0; w < words.length; w++) {
      const letters = words[w].split(' ');

      for (let l = 0; l < letters.length; l++) {
        const letter = letters[l];

        for (let i = 0; i < letter.length; i++) {
          const symbol = letter[i];

          const oscillator = offlineContext.createOscillator();
          oscillator.connect(gainNode);
          oscillator.frequency.value = settings.frequency;
          oscillator.type = 'sine';

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

    return await offlineContext.startRendering();
  }

  audioBufferToWav(buffer: AudioBuffer): Blob {
    const length = buffer.length * buffer.numberOfChannels * 2;
    const arrayBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(arrayBuffer);
    const channels: Float32Array[] = [];
    let offset = 0;
    let pos = 0;

    const writeString = (str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(pos++, str.charCodeAt(i));
      }
    };

    const writeUint32 = (value: number) => {
      view.setUint32(pos, value, true);
      pos += 4;
    };

    const writeUint16 = (value: number) => {
      view.setUint16(pos, value, true);
      pos += 2;
    };

    writeString('RIFF');
    writeUint32(36 + length);
    writeString('WAVE');
    writeString('fmt ');
    writeUint32(16);
    writeUint16(1);
    writeUint16(buffer.numberOfChannels);
    writeUint32(buffer.sampleRate);
    writeUint32(buffer.sampleRate * buffer.numberOfChannels * 2);
    writeUint16(buffer.numberOfChannels * 2);
    writeUint16(16);
    writeString('data');
    writeUint32(length);

    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    while (pos < arrayBuffer.byteLength) {
      for (let i = 0; i < buffer.numberOfChannels; i++) {
        let sample = channels[i][offset];
        sample = Math.max(-1, Math.min(1, sample));
        view.setInt16(pos, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        pos += 2;
      }
      offset++;
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }

  async downloadMorseAsWav(morse: string, settings: PlaybackSettings, filename: string): Promise<void> {
    const buffer = await this.generateMorseAudioBuffer(morse, settings);
    const blob = this.audioBufferToWav(buffer);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
