import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-icon-generator',
  imports: [MatCardModule,MatIconModule],
  templateUrl: './icon-generator.html',
  styleUrl: './icon-generator.scss',
})
export class IconGenerator {

}
