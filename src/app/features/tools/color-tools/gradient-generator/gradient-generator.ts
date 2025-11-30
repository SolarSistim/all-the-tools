import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-gradient-generator',
  imports: [MatCardModule,MatIconModule],
  templateUrl: './gradient-generator.html',
  styleUrl: './gradient-generator.scss',
})
export class GradientGenerator {

}
