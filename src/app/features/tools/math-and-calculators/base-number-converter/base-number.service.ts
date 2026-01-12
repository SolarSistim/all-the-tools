import { Injectable } from '@angular/core';

export interface ConversionResult {
  success: boolean;
  result?: string;
  error?: string;
}

export interface AllBasesResult {
  base2: string;
  base8: string;
  base10: string;
  base12: string;
  base16: string;
  base36: string;
}

@Injectable({
  providedIn: 'root'
})
export class BaseNumberService {
  private supportedBases = [2, 8, 10, 12, 16, 36];

  private getDigitSet(base: number): string {
    if (base <= 10) {
      return '0123456789'.substring(0, base);
    } else if (base === 12) {
      return '0123456789AB';
    } else if (base === 16) {
      return '0123456789ABCDEF';
    } else if (base === 36) {
      return '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    return '';
  }

  private getAllowedDigitsForBase(base: number): string {
    return this.getDigitSet(base);
  }

  private isValidDigitForBase(digit: string, base: number): boolean {
    const digitUpper = digit.toUpperCase();
    return this.getAllowedDigitsForBase(base).includes(digitUpper);
  }

  validateInput(input: string, fromBase: number): { valid: boolean; error?: string } {
    const trimmed = input.trim();
    if (!trimmed) {
      return { valid: true };
    }

    let numberPart = trimmed;
    let isNegative = false;

    if (numberPart.startsWith('-')) {
      isNegative = true;
      numberPart = numberPart.substring(1);
    }

    if (!numberPart) {
      return { valid: true };
    }

    numberPart = numberPart.replace(/[\s_]/g, '');

    if (!numberPart) {
      return { valid: true };
    }

    for (const char of numberPart) {
      if (!this.isValidDigitForBase(char, fromBase)) {
        const allowedDigits = this.getAllowedDigitsForBase(fromBase);
        return {
          valid: false,
          error: `Invalid digit "${char}" for base ${fromBase}. Allowed digits: ${allowedDigits}`
        };
      }
    }

    return { valid: true };
  }

  convertFromBase(input: string, fromBase: number, toBase: number): ConversionResult {
    const trimmed = input.trim();
    if (!trimmed) {
      return { success: true, result: '' };
    }

    const validation = this.validateInput(input, fromBase);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    try {
      let numberPart = trimmed;
      let isNegative = false;

      if (numberPart.startsWith('-')) {
        isNegative = true;
        numberPart = numberPart.substring(1);
      }

      numberPart = numberPart.replace(/[\s_]/g, '');

      if (!numberPart) {
        return { success: true, result: '' };
      }

      const decimal = BigInt(parseInt(numberPart, fromBase));
      let result: string;

      if (toBase === 10) {
        result = decimal.toString();
      } else {
        result = decimal.toString(toBase).toUpperCase();
      }

      if (isNegative) {
        result = '-' + result;
      }

      return { success: true, result };
    } catch (error) {
      return { success: false, error: 'Conversion failed: Invalid number format' };
    }
  }

  convertToAllBases(input: string, fromBase: number): AllBasesResult | null {
    const trimmed = input.trim();
    if (!trimmed || trimmed === '-') {
      return null;
    }

    const validation = this.validateInput(input, fromBase);
    if (!validation.valid) {
      return null;
    }

    try {
      let numberPart = trimmed;
      let isNegative = false;

      if (numberPart.startsWith('-')) {
        isNegative = true;
        numberPart = numberPart.substring(1);
      }

      numberPart = numberPart.replace(/[\s_]/g, '');

      if (!numberPart) {
        return null;
      }

      const decimal = BigInt(parseInt(numberPart, fromBase));

      const formatBase = (num: BigInt, base: number, negative: boolean): string => {
        let result: string;
        if (base === 10) {
          result = num.toString();
        } else {
          result = num.toString(base).toUpperCase();
        }
        return negative ? '-' + result : result;
      };

      return {
        base2: formatBase(decimal, 2, isNegative),
        base8: formatBase(decimal, 8, isNegative),
        base10: formatBase(decimal, 10, isNegative),
        base12: formatBase(decimal, 12, isNegative),
        base16: formatBase(decimal, 16, isNegative),
        base36: formatBase(decimal, 36, isNegative)
      };
    } catch (error) {
      return null;
    }
  }

  getBaseLabel(base: number): string {
    const labels: { [key: number]: string } = {
      2: 'Binary',
      8: 'Octal',
      10: 'Decimal',
      12: 'Duodecimal',
      16: 'Hexadecimal',
      36: 'Base 36'
    };
    return labels[base] || `Base ${base}`;
  }

  getSupportedBases(): number[] {
    return this.supportedBases;
  }

  getPrimaryBases(): number[] {
    return [2, 8, 10, 12];
  }

  getExtraBases(): number[] {
    return [16, 36];
  }
}
