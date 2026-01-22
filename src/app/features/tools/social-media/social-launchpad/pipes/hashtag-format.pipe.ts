import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hashtagFormat',
  standalone: true
})
export class HashtagFormatPipe implements PipeTransform {
  transform(value: string, lowercase: boolean = false): string {
    if (!value) {
      return '';
    }

    // Remove all whitespace
    let formatted = value.replace(/\s/g, '');

    // Add # prefix if missing
    if (!formatted.startsWith('#')) {
      formatted = '#' + formatted;
    }

    // Convert to lowercase if requested
    if (lowercase) {
      formatted = formatted.toLowerCase();
    }

    return formatted;
  }
}
