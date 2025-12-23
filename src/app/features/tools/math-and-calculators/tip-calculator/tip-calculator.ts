import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { ToolsService } from '../../../../core/services/tools.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';
import { MetaService } from '../../../../core/services/meta.service';
import { Tool, ToolCategoryMeta } from '../../../../core/models/tool.interface';
import { ToolCardComponent } from '../../../../shared/components/tool-card/tool-card';
import { CtaEmailList } from '../../../reusable-components/cta-email-list/cta-email-list';
import { AdsenseComponent } from '../../../blog/components/adsense/adsense.component';

@Component({
  selector: 'app-tip-calculator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    PageHeaderComponent,
    ToolCardComponent,
    CtaEmailList,
    AdsenseComponent
  ],
  templateUrl: './tip-calculator.html',
  styleUrl: './tip-calculator.scss'
})
export class TipCalculator implements OnInit {

  toolsService = inject(ToolsService);
  private metaService = inject(MetaService);

  featuredTools: Tool[] = [];
  categories: ToolCategoryMeta[] = [];

  ngOnInit(): void {
    this.metaService.updateTags({
      title: 'Tip Calculator',
      description: 'Calculate tip amounts and split bills easily. Perfect for restaurants, delivery services, and more.',
      keywords: ['tip calculator', 'split bill', 'gratuity calculator', 'restaurant tip', 'bill splitter'],
      image: 'https://www.allthethings.dev/meta-images/og-tip-calculator.png',
      url: 'https://www.allthethings.dev/tools/tip-calculator'
    });

    this.featuredTools = this.toolsService.getFeaturedTools();
    this.categories = this.toolsService.getAllCategories();
  }

  // Basic Tip Calculator
  billAmount = signal<number | null>(null);
  tipPercentage = signal<number | null>(null);
  tipAmount = signal<number | null>(null);
  totalAmount = signal<number | null>(null);

  // Split Bill Calculator
  billAmount2 = signal<number | null>(null);
  tipPercentage2 = signal<number | null>(null);
  numberOfPeople = signal<number | null>(null);
  tipPerPerson = signal<number | null>(null);
  totalPerPerson = signal<number | null>(null);
  grandTotal = signal<number | null>(null);

  calculateTip(): void {
    const bill = this.billAmount();
    const tip = this.tipPercentage();

    if (bill !== null && tip !== null && !isNaN(bill) && !isNaN(tip) && bill > 0 && tip >= 0) {
      const tipAmt = (bill * tip) / 100;
      const total = bill + tipAmt;

      this.tipAmount.set(tipAmt);
      this.totalAmount.set(total);
    } else {
      this.tipAmount.set(null);
      this.totalAmount.set(null);
    }
  }

  setTipPercentage(percentage: number): void {
    this.tipPercentage.set(percentage);
    this.calculateTip();
  }

  calculateSplitBill(): void {
    const bill = this.billAmount2();
    const tip = this.tipPercentage2();
    const people = this.numberOfPeople();

    if (bill !== null && tip !== null && people !== null &&
        !isNaN(bill) && !isNaN(tip) && !isNaN(people) &&
        bill > 0 && tip >= 0 && people > 0) {

      const tipAmt = (bill * tip) / 100;
      const total = bill + tipAmt;
      const tipPerPerson = tipAmt / people;
      const totalPerPerson = total / people;

      this.tipPerPerson.set(tipPerPerson);
      this.totalPerPerson.set(totalPerPerson);
      this.grandTotal.set(total);
    } else {
      this.tipPerPerson.set(null);
      this.totalPerPerson.set(null);
      this.grandTotal.set(null);
    }
  }

  setTipPercentage2(percentage: number): void {
    this.tipPercentage2.set(percentage);
    this.calculateSplitBill();
  }

  scrollToTipCalculator(): void {
    const element = document.querySelector('.cta-button');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }


}