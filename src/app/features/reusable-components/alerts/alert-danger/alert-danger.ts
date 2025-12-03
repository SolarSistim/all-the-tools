import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-alert-danger',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './alert-danger.html',
  styleUrl: './alert-danger.scss'
})
export class AlertDanger {
  @Input() title: string = 'Important Notice';
  @Input() content: string = '';
  @Input() icon: string = 'error';
}