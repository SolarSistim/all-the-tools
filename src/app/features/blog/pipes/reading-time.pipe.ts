import { Pipe, PipeTransform } from '@angular/core';

/**
 * Reading Time Pipe
 * Formats reading time in a human-readable format
 */
@Pipe({
  name: 'readingTime',
  standalone: true,
})
export class ReadingTimePipe implements PipeTransform {
  transform(minutes: number): string {
    if (!minutes || minutes < 1) {
      return '< 1 min read';
    }

    if (minutes === 1) {
      return '1 min read';
    }

    return `${minutes} min read`;
  }
}
