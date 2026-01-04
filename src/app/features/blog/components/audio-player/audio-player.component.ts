import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Audio Player Component
 * Displays an audio player with waveform visualization for MP3 files
 */
@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.scss',
})
export class AudioPlayerComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() src: string = '';
  @Input() title?: string;
  @Input() description?: string;

  @ViewChild('audioElement') audioElementRef!: ElementRef<HTMLAudioElement>;
  @ViewChild('waveformCanvas') waveformCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('previewCanvas') previewCanvasRef!: ElementRef<HTMLCanvasElement>;

  isPlaying = false;
  currentTime = 0;
  duration = 0;
  isLoading = true;
  error = false;
  isLoadingWaveform = true;
  isExpanded = false;

  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private animationFrameId: number | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private waveformData: number[] = [];
  private isDragging = false;
  private isInitialized = false;

  ngOnInit(): void {
    // Validate src input
    if (!this.src) {
      this.error = true;
      this.isLoading = false;
    }
  }

  ngAfterViewInit(): void {
    // Initialization now happens when player is expanded
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private setupAudioContext(): void {
    try {
      const audioElement = this.audioElementRef.nativeElement;

      // Create audio context
      this.audioContext = new AudioContext();

      // Create analyser node
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);

      // Create source from audio element
      this.source = this.audioContext.createMediaElementSource(audioElement);
      this.source.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);

      // Start drawing waveform
      this.drawWaveform();
    } catch (err) {
      console.error('Error setting up audio context:', err);
      this.error = true;
    }
  }

  private drawWaveform(): void {
    if (!this.analyser || !this.dataArray || !this.waveformCanvasRef) {
      return;
    }

    const canvas = this.waveformCanvasRef.nativeElement;
    const canvasContext = canvas.getContext('2d');

    if (!canvasContext) return;

    const draw = () => {
      this.animationFrameId = requestAnimationFrame(draw);

      this.analyser!.getByteTimeDomainData(this.dataArray!);

      canvasContext.fillStyle = 'rgb(15, 23, 42)'; // Dark background
      canvasContext.fillRect(0, 0, canvas.width, canvas.height);

      canvasContext.lineWidth = 2;
      canvasContext.strokeStyle = 'rgb(59, 130, 246)'; // Blue waveform
      canvasContext.beginPath();

      const sliceWidth = canvas.width / this.dataArray!.length;
      let x = 0;

      for (let i = 0; i < this.dataArray!.length; i++) {
        const v = this.dataArray![i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          canvasContext.moveTo(x, y);
        } else {
          canvasContext.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasContext.lineTo(canvas.width, canvas.height / 2);
      canvasContext.stroke();
    };

    draw();
  }

  togglePlayPause(): void {
    const audioElement = this.audioElementRef.nativeElement;

    if (this.isPlaying) {
      audioElement.pause();
    } else {
      // Resume audio context if suspended
      if (this.audioContext?.state === 'suspended') {
        this.audioContext.resume();
      }
      audioElement.play();
    }

    this.isPlaying = !this.isPlaying;
  }

  onTimeUpdate(): void {
    const audioElement = this.audioElementRef.nativeElement;
    this.currentTime = audioElement.currentTime;
    this.updatePreviewProgress();
  }

  onLoadedMetadata(): void {
    const audioElement = this.audioElementRef.nativeElement;
    this.duration = audioElement.duration;
    this.isLoading = false;

    // Redraw waveform now that we have duration
    if (this.waveformData.length > 0) {
      this.updatePreviewProgress();
    }
  }

  onError(): void {
    this.error = true;
    this.isLoading = false;
  }

  seek(event: MouseEvent | TouchEvent): void {
    if (this.duration === 0) return; // Wait for metadata to load

    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();

    // Handle both mouse and touch events
    const clientX = event instanceof MouseEvent
      ? event.clientX
      : event.touches[0]?.clientX || event.changedTouches[0]?.clientX;

    if (!clientX) return;

    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const audioElement = this.audioElementRef.nativeElement;
    audioElement.currentTime = percent * this.duration;
  }

  formatTime(seconds: number): string {
    if (!isFinite(seconds)) return '0:00';

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  get progressPercent(): number {
    return this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
  }

  private async loadAndGenerateWaveform(): Promise<void> {
    try {
      console.log('Loading waveform from:', this.src);

      // Fetch the audio file
      const response = await fetch(this.src);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      console.log('Audio buffer loaded, size:', arrayBuffer.byteLength);

      // Create a separate audio context for decoding
      const offlineContext = new AudioContext();
      const audioBuffer = await offlineContext.decodeAudioData(arrayBuffer);
      console.log('Audio decoded, duration:', audioBuffer.duration, 'channels:', audioBuffer.numberOfChannels);

      // Extract waveform data
      this.waveformData = this.extractWaveformData(audioBuffer);
      console.log('Waveform data extracted, points:', this.waveformData.length);

      // Draw the static waveform
      this.drawStaticWaveform();
      console.log('Static waveform drawn');

      this.isLoadingWaveform = false;
      offlineContext.close();
    } catch (err) {
      console.error('Error loading waveform:', err);
      this.isLoadingWaveform = false;
    }
  }

  private extractWaveformData(audioBuffer: AudioBuffer): number[] {
    const rawData = audioBuffer.getChannelData(0); // Use first channel
    const samples = 800; // Number of samples to display
    const blockSize = Math.floor(rawData.length / samples);
    const filteredData: number[] = [];

    for (let i = 0; i < samples; i++) {
      const blockStart = blockSize * i;
      let sum = 0;

      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(rawData[blockStart + j]);
      }

      filteredData.push(sum / blockSize);
    }

    // Normalize the data
    const max = Math.max(...filteredData);
    return filteredData.map((value) => value / max);
  }

  private drawStaticWaveform(): void {
    if (!this.previewCanvasRef || this.waveformData.length === 0) {
      return;
    }

    const canvas = this.previewCanvasRef.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const barWidth = width / this.waveformData.length;

    // Clear canvas
    ctx.fillStyle = 'rgb(15, 23, 42)';
    ctx.fillRect(0, 0, width, height);

    // Draw initial waveform bars (all gray since we don't have progress yet)
    ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';

    for (let i = 0; i < this.waveformData.length; i++) {
      const barHeight = this.waveformData[i] * height * 0.8;
      const x = i * barWidth;
      const y = (height - barHeight) / 2;

      ctx.fillRect(x, y, barWidth, barHeight);
    }
  }

  private updatePreviewProgress(): void {
    if (!this.previewCanvasRef || this.waveformData.length === 0 || this.duration === 0) {
      return;
    }

    const canvas = this.previewCanvasRef.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const barWidth = width / this.waveformData.length;
    const progressRatio = this.currentTime / this.duration;

    // Redraw entire waveform
    ctx.fillStyle = 'rgb(15, 23, 42)';
    ctx.fillRect(0, 0, width, height);

    // Draw waveform bars with progress color
    for (let i = 0; i < this.waveformData.length; i++) {
      const barHeight = this.waveformData[i] * height * 0.8;
      const x = i * barWidth;
      const y = (height - barHeight) / 2;

      // Color bars based on progress
      const barProgress = i / this.waveformData.length;
      ctx.fillStyle = barProgress <= progressRatio
        ? 'rgb(59, 130, 246)' // Played portion (blue)
        : 'rgba(148, 163, 184, 0.6)'; // Unplayed portion (gray)

      ctx.fillRect(x, y, barWidth, barHeight);
    }

    // Draw progress line
    const progressX = width * progressRatio;
    ctx.strokeStyle = 'rgb(239, 68, 68)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(progressX, 0);
    ctx.lineTo(progressX, height);
    ctx.stroke();
  }

  seekPreview(event: MouseEvent | TouchEvent): void {
    if (this.duration === 0) return; // Wait for metadata to load

    const canvas = event.currentTarget as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();

    // Handle both mouse and touch events
    const clientX = event instanceof MouseEvent
      ? event.clientX
      : event.touches[0]?.clientX || event.changedTouches[0]?.clientX;

    if (!clientX) return;

    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const audioElement = this.audioElementRef.nativeElement;
    audioElement.currentTime = percent * this.duration;
  }

  onPreviewMouseDown(event: MouseEvent | TouchEvent): void {
    event.preventDefault(); // Prevent default touch behavior
    this.isDragging = true;
    this.seekPreview(event);
  }

  onPreviewMouseMove(event: MouseEvent | TouchEvent): void {
    if (this.isDragging) {
      event.preventDefault(); // Prevent scrolling while dragging
      this.seekPreview(event);
    }
  }

  onPreviewMouseUp(): void {
    this.isDragging = false;
  }

  onPreviewMouseLeave(): void {
    this.isDragging = false;
  }

  private cleanup(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (this.audioContext) {
      this.audioContext.close();
    }
  }

  expandPlayer(): void {
    this.isExpanded = true;

    // Initialize audio context and waveform after view updates
    setTimeout(() => {
      if (!this.isInitialized && !this.error && this.audioElementRef) {
        this.setupAudioContext();
        this.loadAndGenerateWaveform();
        this.isInitialized = true;

        // Auto-play after initialization
        setTimeout(() => {
          if (this.audioContext?.state === 'suspended') {
            this.audioContext.resume();
          }
          const audioElement = this.audioElementRef.nativeElement;
          audioElement.play().then(() => {
            this.isPlaying = true;
          }).catch((err) => {
            console.warn('Auto-play prevented by browser:', err);
          });
        }, 100);
      }
    }, 0);
  }

  collapsePlayer(): void {
    this.isExpanded = false;

    // Stop playback when collapsing
    if (this.isPlaying) {
      const audioElement = this.audioElementRef.nativeElement;
      audioElement.pause();
      audioElement.currentTime = 0;
      this.isPlaying = false;
    }
  }
}
