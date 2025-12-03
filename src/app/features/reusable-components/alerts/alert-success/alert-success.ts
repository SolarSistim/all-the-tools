import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-alert-success',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './alert-success.html',
  styleUrl: './alert-success.scss'
})
export class AlertSuccess {
  @Input() title: string = 'Success';
  @Input() content: string = '';
  @Input() icon: string = 'check_circle';
}