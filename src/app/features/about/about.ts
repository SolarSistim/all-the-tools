import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [MatIconModule, PageHeaderComponent],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class AboutComponent {

}
