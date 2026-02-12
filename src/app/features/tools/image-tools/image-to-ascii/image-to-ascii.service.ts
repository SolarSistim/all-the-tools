import { Injectable } from '@angular/core';

export interface ConversionOptions {
  width: number;
  charSet: string;
  inverted: boolean;
  preserveAspectRatio: boolean;
}

export interface CharacterSetOption {
  id: string;
  name: string;
  chars: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageToAsciiService {

  getCharacterSets(): CharacterSetOption[] {
    return [
      {
        id: 'standard',
        name: 'Standard',
        chars: '@%#*+=-:. ',
        description: 'Classic ASCII art characters with good contrast'
      },
      {
        id: 'detailed',
        name: 'Detailed',
        chars: '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. ',
        description: 'Maximum detail with extensive character set'
      },
      {
        id: 'simple',
        name: 'Simple',
        chars: '█▓▒░ ',
        description: 'Block characters for cleaner, modern look'
      }
    ];
  }

  getDefaultOptions(): ConversionOptions {
    return {
      width: 100,
      charSet: '@%#*+=-:. ',
      inverted: false,
      preserveAspectRatio: true
    };
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

  validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { valid: false, error: 'File size exceeds 10MB limit' };
    }

    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
    if (!validTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid file type. Please upload JPG, PNG, GIF, WebP, or AVIF' };
    }

    return { valid: true };
  }

  async convertToAscii(
    image: HTMLImageElement,
    options: ConversionOptions
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Create canvas to draw image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Calculate dimensions
        const aspectRatio = image.height / image.width;
        const width = options.width;
        const height = options.preserveAspectRatio
          ? Math.floor(width * aspectRatio * 0.5) // 0.5 factor to account for character height/width ratio
          : Math.floor(width * 0.5);

        canvas.width = width;
        canvas.height = height;

        // Draw image to canvas
        ctx.drawImage(image, 0, 0, width, height);

        // Get image data
        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;

        // Convert to ASCII
        const chars = options.charSet.split('');
        const charsLength = chars.length;
        let ascii = '';

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const offset = (y * width + x) * 4;
            const r = pixels[offset];
            const g = pixels[offset + 1];
            const b = pixels[offset + 2];
            const alpha = pixels[offset + 3];

            // Calculate grayscale value
            const gray = (r + g + b) / 3;

            // Map to character based on brightness
            let brightness = options.inverted ? (255 - gray) : gray;

            // Handle transparency
            if (alpha < 128) {
              brightness = options.inverted ? 255 : 0;
            }

            const charIndex = Math.floor((brightness / 255) * (charsLength - 1));
            ascii += chars[charIndex];
          }
          ascii += '\n';
        }

        resolve(ascii);
      } catch (error) {
        reject(error);
      }
    });
  }

  getTimestampFilename(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `ascii-art-${year}-${month}-${day}_${hours}${minutes}`;
  }
}
