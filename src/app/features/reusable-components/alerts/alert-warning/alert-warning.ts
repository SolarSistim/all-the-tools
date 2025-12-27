import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-alert-warning',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './alert-warning.html',
  styleUrl: './alert-warning.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class AlertWarning {
  @Input() title: string = 'Warning';
  @Input() content: string = '';
  @Input() icon: string = 'warning';
}
