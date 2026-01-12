import { Injectable } from '@angular/core';

export interface FilterAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  warmth: number;
  tint: number;
  exposure: number;
  vignette: number;
  sharpness: number;
}

export interface FilterPreset {
  id: string;
  name: string;
  adjustments: Partial<FilterAdjustments>;
}

@Injectable({
  providedIn: 'root'
})
export class PhotoFilterStudioService {

  getDefaultAdjustments(): FilterAdjustments {
    return {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      warmth: 0,
      tint: 0,
      exposure: 0,
      vignette: 0,
      sharpness: 0
    };
  }

  getPresets(): FilterPreset[] {
    return [
      {
        id: 'clean',
        name: 'Clean',
        adjustments: {
          brightness: 5,
          contrast: 10,
          saturation: 5,
          warmth: 0,
          tint: 0,
          vignette: 0
        }
      },
      {
        id: 'vivid',
        name: 'Vivid',
        adjustments: {
          brightness: 0,
          contrast: 20,
          saturation: 30,
          warmth: 5,
          tint: 0,
          vignette: 0
        }
      },
      {
        id: 'warm-glow',
        name: 'Warm Glow',
        adjustments: {
          brightness: 10,
          contrast: 5,
          saturation: 15,
          warmth: 40,
          tint: 10,
          vignette: 5
        }
      },
      {
        id: 'cool-fade',
        name: 'Cool Fade',
        adjustments: {
          brightness: -5,
          contrast: 15,
          saturation: 10,
          warmth: -30,
          tint: -15,
          vignette: 10
        }
      },
      {
        id: 'matte',
        name: 'Matte',
        adjustments: {
          brightness: 0,
          contrast: -10,
          saturation: -20,
          warmth: 10,
          tint: 5,
          vignette: 15
        }
      },
      {
        id: 'classic',
        name: 'Classic',
        adjustments: {
          brightness: 5,
          contrast: 15,
          saturation: -5,
          warmth: 10,
          tint: 0,
          vignette: 0
        }
      },
      {
        id: 'punch',
        name: 'Punch',
        adjustments: {
          brightness: -5,
          contrast: 30,
          saturation: 40,
          warmth: 15,
          tint: 5,
          vignette: 0
        }
      },
      {
        id: 'noir',
        name: 'Noir',
        adjustments: {
          brightness: -20,
          contrast: 40,
          saturation: -100,
          warmth: 5,
          tint: 0,
          vignette: 30
        }
      }
    ];
  }

  applyFiltersToCanvas(
    canvas: HTMLCanvasElement,
    sourceImage: HTMLImageElement,
    adjustments: FilterAdjustments
  ): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const filterString = this.buildFilterString(adjustments);
    ctx.filter = filterString;
    ctx.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);

    if (adjustments.vignette > 0) {
      this.applyVignette(ctx, canvas.width, canvas.height, adjustments.vignette);
    }

    if (adjustments.sharpness > 0) {
      this.applySharpness(canvas, adjustments.sharpness);
    }
  }

  private buildFilterString(adjustments: FilterAdjustments): string {
    const filters: string[] = [];

    const brightness = 100 + adjustments.brightness;
    filters.push(`brightness(${brightness}%)`);

    const contrast = 100 + adjustments.contrast;
    filters.push(`contrast(${contrast}%)`);

    const saturation = 100 + adjustments.saturation;
    filters.push(`saturate(${saturation}%)`);

    const warmth = adjustments.warmth;
    const hueRotate = warmth / 3;
    filters.push(`hue-rotate(${hueRotate}deg)`);

    return filters.join(' ');
  }

  private applyVignette(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    intensity: number
  ): void {
    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      Math.max(width, height)
    );

    const alpha = Math.min(intensity / 100, 0.8);
    gradient.addColorStop(0, `rgba(0, 0, 0, 0)`);
    gradient.addColorStop(0.5, `rgba(0, 0, 0, 0)`);
    gradient.addColorStop(1, `rgba(0, 0, 0, ${alpha})`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  private applySharpness(canvas: HTMLCanvasElement, intensity: number): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const kernel = [
      0, -1, 0,
      -1, 5, -1,
      0, -1, 0
    ];

    const normalizedIntensity = intensity / 100;

    for (let i = 0; i < data.length; i += 4) {
      const pixelIndex = i / 4;
      const col = pixelIndex % canvas.width;
      const row = Math.floor(pixelIndex / canvas.width);

      if (row === 0 || row === canvas.height - 1 || col === 0 || col === canvas.width - 1) {
        continue;
      }

      let r = 0, g = 0, b = 0;
      let kernelIndex = 0;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const neighborIndex = ((row + dy) * canvas.width + (col + dx)) * 4;
          r += data[neighborIndex] * kernel[kernelIndex];
          g += data[neighborIndex + 1] * kernel[kernelIndex];
          b += data[neighborIndex + 2] * kernel[kernelIndex];
          kernelIndex++;
        }
      }

      const originalR = data[i];
      const originalG = data[i + 1];
      const originalB = data[i + 2];

      data[i] = Math.min(255, originalR + (r - originalR) * normalizedIntensity);
      data[i + 1] = Math.min(255, originalG + (g - originalG) * normalizedIntensity);
      data[i + 2] = Math.min(255, originalB + (b - originalB) * normalizedIntensity);
    }

    ctx.putImageData(imageData, 0, 0);
  }

  async loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  downloadImage(canvas: HTMLCanvasElement, filename: string, format: 'png' | 'jpeg', quality: number): void {
    const link = document.createElement('a');
    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const extension = format === 'jpeg' ? '.jpg' : '.png';

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = filename + extension;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      },
      mimeType,
      quality / 100
    );
  }

  getTimestampFilename(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `photo-filter-studio-${year}-${month}-${day}_${hours}${minutes}`;
  }
}
