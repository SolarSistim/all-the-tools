import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-alert-primary',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './alert-primary.html',
  styleUrl: './alert-primary.scss'
})
export class AlertPrimary {
  @Input() title: string = 'Information';
  @Input() content: string = '';
  @Input() icon: string = 'info';
}