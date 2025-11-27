import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-presskit',
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './presskit.html',
  styleUrl: './presskit.scss',
})
export class Presskit {

  private iconPool = [
    'calculate', 'text_fields', 'palette', 'swap_horiz',
    'password', 'qr_code', 'schedule', 'percent',
    'thermostat', 'gradient', 'fingerprint', 'notes'
  ];

  getRandomIcon(index: number): string {
    return this.iconPool[index % this.iconPool.length];
  }

}
