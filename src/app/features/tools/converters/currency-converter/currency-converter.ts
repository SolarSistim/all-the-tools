import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CtaEmailList } from '../../../reusable-components/cta-email-list/cta-email-list';

@Component({
  selector: 'app-currency-converter',
  standalone: true,
  imports: [MatIconModule,CtaEmailList],
  templateUrl: './currency-converter.html',
  styleUrl: './currency-converter.scss',
})
export class CurrencyConverter {

}
