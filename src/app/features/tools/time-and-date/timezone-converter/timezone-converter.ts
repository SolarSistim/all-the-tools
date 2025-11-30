import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-timezone-converter',
  imports: [MatCardModule,MatIconModule],
  templateUrl: './timezone-converter.html',
  styleUrl: './timezone-converter.scss',
})
export class TimezoneConverter {

}
