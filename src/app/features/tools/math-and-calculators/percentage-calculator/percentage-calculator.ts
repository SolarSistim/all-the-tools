import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-percentage-calculator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    PageHeaderComponent
  ],
  templateUrl: './percentage-calculator.html',
  styleUrl: './percentage-calculator.scss'
})
export class PercentageCalculatorComponent {
  // Calculate X% of Y
  percentage1 = signal<number | null>(null);
  number1 = signal<number | null>(null);
  result1 = signal<number | null>(null);

  // What percent is Y of X
  part = signal<number | null>(null);
  whole = signal<number | null>(null);
  result2 = signal<number | null>(null);

  calculatePercentageOf(): void {
    const pct = this.percentage1();
    const num = this.number1();

    if (pct !== null && num !== null && !isNaN(pct) && !isNaN(num)) {
      this.result1.set((pct / 100) * num);
    } else {
      this.result1.set(null);
    }
  }

  calculateWhatPercent(): void {
    const partVal = this.part();
    const wholeVal = this.whole();

    if (partVal !== null && wholeVal !== null && !isNaN(partVal) && !isNaN(wholeVal) && wholeVal !== 0) {
      this.result2.set((partVal / wholeVal) * 100);
    } else {
      this.result2.set(null);
    }
  }
}
