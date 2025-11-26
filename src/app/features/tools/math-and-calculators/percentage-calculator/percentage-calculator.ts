import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ToolsService } from '../../../../core/services/tools.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';
import { MetaService } from '../../../../core/services/meta.service';
import { Tool, ToolCategoryMeta } from '../../../../core/models/tool.interface';
import { ToolCardComponent } from '../../../../shared/components/tool-card/tool-card';

@Component({
  selector: 'app-percentage-calculator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    PageHeaderComponent,
    ToolCardComponent
  ],
  templateUrl: './percentage-calculator.html',
  styleUrl: './percentage-calculator.scss'
})
export class PercentageCalculatorComponent implements OnInit {

  toolsService = inject(ToolsService); // Made public for template access
  private metaService = inject(MetaService);

  featuredTools: Tool[] = [];
  categories: ToolCategoryMeta[] = [];

    ngOnInit(): void {
    this.metaService.updateTags({
      title: 'All The Tools - Percentage Calculator',
      description: 'Calculate percentages and find what percent one number is of another',
      keywords: ['online tools', 'web utilities', 'free tools', 'text tools', 'calculators', 'converters'],
      image: 'https://all-the-tools.netlify.app/meta-images/og-percentage-calculator.png',
      url: 'https://all-the-tools.netlify.app/tools/percentage-calculator'
    });

    this.featuredTools = this.toolsService.getFeaturedTools();
    this.categories = this.toolsService.getAllCategories();
  }



  // Calculate X% of Y
  percentage1 = signal<number | null>(null);
  number1 = signal<number | null>(null);
  result1 = signal<number | null>(null);

  // What percent is Y of X
  part = signal<number | null>(null);
  whole = signal<number | null>(null);
  result2 = signal<number | null>(null);

  calculatePercentageOf(): void {
    const pct = this.percentage1();
    const num = this.number1();

    if (pct !== null && num !== null && !isNaN(pct) && !isNaN(num)) {
      this.result1.set((pct / 100) * num);
    } else {
      this.result1.set(null);
    }
  }

  calculateWhatPercent(): void {
    const partVal = this.part();
    const wholeVal = this.whole();

    if (partVal !== null && wholeVal !== null && !isNaN(partVal) && !isNaN(wholeVal) && wholeVal !== 0) {
      this.result2.set((partVal / wholeVal) * 100);
    } else {
      this.result2.set(null);
    }
  }
}
