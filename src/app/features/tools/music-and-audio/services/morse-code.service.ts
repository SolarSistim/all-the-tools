import { Injectable } from '@angular/core';

export interface MorseCharacter {
  char: string;
  morse: string;
}

@Injectable({
  providedIn: 'root'
})
export class MorseCodeService {
  private readonly morseMap: Map<string, string> = new Map([
    ['A', '.-'], ['B', '-...'], ['C', '-.-.'], ['D', '-..'],
    ['E', '.'], ['F', '..-.'], ['G', '--.'], ['H', '....'],
    ['I', '..'], ['J', '.---'], ['K', '-.-'], ['L', '.-..'],
    ['M', '--'], ['N', '-.'], ['O', '---'], ['P', '.--.'],
    ['Q', '--.-'], ['R', '.-.'], ['S', '...'], ['T', '-'],
    ['U', '..-'], ['V', '...-'], ['W', '.--'], ['X', '-..-'],
    ['Y', '-.--'], ['Z', '--..'],
    ['0', '-----'], ['1', '.----'], ['2', '..---'], ['3', '...--'],
    ['4', '....-'], ['5', '.....'], ['6', '-....'], ['7', '--...'],
    ['8', '---..'], ['9', '----.'],
    ['.', '.-.-.-'], [',', '--..--'], ['?', '..--..'], ['!', '-.-.--'],
    ['/', '-..-.'], ['(', '-.--.'], [')', '-.--.-'], ['&', '.-...'],
    [':', '---...'], [';', '-.-.-.'], ['=', '-...-'], ['+', '.-.-.'],
    ['-', '-....-'], ['_', '..--.-'], ['"', '.-..-.'], ["'", '.----.'],
    ['$', '...-..-'], ['@', '.--.-.']
  ]);

  private readonly reverseMorseMap: Map<string, string> = new Map();

  constructor() {
    this.morseMap.forEach((morse, char) => {
      this.reverseMorseMap.set(morse, char);
    });
  }

  textToMorse(text: string): { morse: string; visual: string; unsupportedChars: string[] } {
    const normalized = text.toUpperCase();
    const unsupportedChars: string[] = [];
    const words: string[] = [];
    const visualParts: string[] = [];

    const textWords = normalized.split(' ');

    for (const word of textWords) {
      const letters: string[] = [];
      const visualLetters: string[] = [];

      for (const char of word) {
        if (char === ' ') continue;

        const morseCode = this.morseMap.get(char);
        if (morseCode) {
          letters.push(morseCode);
          visualLetters.push(this.morseToVisual(morseCode));
        } else if (char.trim()) {
          if (!unsupportedChars.includes(char)) {
            unsupportedChars.push(char);
          }
        }
      }

      if (letters.length > 0) {
        words.push(letters.join(' '));
        visualParts.push(visualLetters.join('   '));
      }
    }

    return {
      morse: words.join(' / '),
      visual: visualParts.join('       '),
      unsupportedChars
    };
  }

  private morseToVisual(morse: string): string {
    return morse
      .split('')
      .map(symbol => {
        if (symbol === '.') return '•';
        if (symbol === '-') return '—';
        return symbol;
      })
      .join('');
  }

  morseToTimingBar(morse: string): string {
    const parts: string[] = [];
    const words = morse.split(' / ');

    for (let w = 0; w < words.length; w++) {
      const letters = words[w].split(' ');

      for (let l = 0; l < letters.length; l++) {
        const letter = letters[l];

        for (let i = 0; i < letter.length; i++) {
          const symbol = letter[i];

          if (symbol === '.') {
            parts.push('█');
          } else if (symbol === '-') {
            parts.push('███');
          }

          if (i < letter.length - 1) {
            parts.push('▁');
          }
        }

        if (l < letters.length - 1) {
          parts.push('▁▁▁');
        }
      }

      if (w < words.length - 1) {
        parts.push('▁▁▁▁▁▁▁');
      }
    }

    return parts.join('');
  }

  morseToText(morse: string): string {
    const words = morse.split(' / ');
    const resultWords: string[] = [];

    for (const word of words) {
      const letters = word.split(' ');
      const resultLetters: string[] = [];

      for (const letter of letters) {
        const char = this.reverseMorseMap.get(letter);
        if (char) {
          resultLetters.push(char);
        } else if (letter.trim()) {
          resultLetters.push('?');
        }
      }

      resultWords.push(resultLetters.join(''));
    }

    return resultWords.join(' ');
  }

  getSupportedCharacters(): string {
    return 'A-Z, 0-9, . , ? ! / ( ) & : ; = + - _ " \' $ @';
  }

  getAllMorseCharacters(): MorseCharacter[] {
    const characters: MorseCharacter[] = [];

    // Add letters
    for (let i = 0; i < 26; i++) {
      const char = String.fromCharCode(65 + i); // A-Z
      const morse = this.morseMap.get(char);
      if (morse) {
        characters.push({ char, morse });
      }
    }

    // Add numbers
    for (let i = 0; i < 10; i++) {
      const char = i.toString();
      const morse = this.morseMap.get(char);
      if (morse) {
        characters.push({ char, morse });
      }
    }

    // Add special characters in order of the morseMap
    const specialChars = ['.', ',', '?', '!', '/', '(', ')', '&', ':', ';', '=', '+', '-', '_', '"', "'", '$', '@'];
    for (const char of specialChars) {
      const morse = this.morseMap.get(char);
      if (morse) {
        characters.push({ char, morse });
      }
    }

    return characters;
  }
}
