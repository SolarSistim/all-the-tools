import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-presskit',
  imports: [CommonModule,MatIconModule],
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
