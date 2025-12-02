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
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ToolsService } from '../../../../core/services/tools.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';
import { MetaService } from '../../../../core/services/meta.service';
import { Tool, ToolCategoryMeta } from '../../../../core/models/tool.interface';
import { ToolCardComponent } from '../../../../shared/components/tool-card/tool-card';

@Component({
  selector: 'app-body-mass-index-calculator',
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
    MatButtonToggleModule,
    PageHeaderComponent,
    ToolCardComponent
  ],
  templateUrl: './body-mass-index-calculator.html',
  styleUrl: './body-mass-index-calculator.scss'
})
export class BodyMassIndexCalculator implements OnInit {

  toolsService = inject(ToolsService);
  private metaService = inject(MetaService);

  featuredTools: Tool[] = [];
  categories: ToolCategoryMeta[] = [];

  ngOnInit(): void {
    this.metaService.updateTags({
      title: 'Body Mass Index Calculator',
      description: 'Calculate your Body Mass Index (BMI) with support for both metric and imperial units. Get instant health insights.',
      keywords: ['bmi calculator', 'body mass index', 'health calculator', 'weight calculator', 'fitness'],
      image: 'https://www.allthethings.dev/meta-images/og-bmi-calculator.png',
      url: 'https://www.allthethings.dev/tools/bmi-calculator'
    });

    this.featuredTools = this.toolsService.getFeaturedTools();
    this.categories = this.toolsService.getAllCategories();
  }

  // Unit system
  unitSystem = signal<'metric' | 'imperial'>('imperial');

  // Metric inputs
  weightKg = signal<number | null>(null);
  heightCm = signal<number | null>(null);

  // Imperial inputs
  weightLbs = signal<number | null>(null);
  heightFeet = signal<number | null>(null);
  heightInches = signal<number | null>(null);

  // Results
  bmi = signal<number | null>(null);
  category = signal<string | null>(null);
  categoryColor = signal<string>('');

  calculateBMI(): void {
    let weightInKg: number;
    let heightInMeters: number;

    if (this.unitSystem() === 'metric') {
      const weight = this.weightKg();
      const height = this.heightCm();

      if (weight !== null && height !== null && !isNaN(weight) && !isNaN(height) &&
          weight > 0 && height > 0) {
        weightInKg = weight;
        heightInMeters = height / 100; // Convert cm to meters
      } else {
        this.clearResults();
        return;
      }
    } else {
      const weight = this.weightLbs();
      const feet = this.heightFeet() || 0;
      const inches = this.heightInches() || 0;

      if (weight !== null && !isNaN(weight) && weight > 0 && (feet > 0 || inches > 0)) {
        weightInKg = weight * 0.453592; // Convert lbs to kg
        const totalInches = (feet * 12) + inches;
        heightInMeters = totalInches * 0.0254; // Convert inches to meters
      } else {
        this.clearResults();
        return;
      }
    }

    // Calculate BMI
    const bmiValue = weightInKg / (heightInMeters * heightInMeters);
    this.bmi.set(bmiValue);

    // Determine category
    this.updateCategory(bmiValue);
  }

  private updateCategory(bmiValue: number): void {
    if (bmiValue < 18.5) {
      this.category.set('Underweight');
      this.categoryColor.set('underweight');
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      this.category.set('Normal weight');
      this.categoryColor.set('normal');
    } else if (bmiValue >= 25 && bmiValue < 30) {
      this.category.set('Overweight');
      this.categoryColor.set('overweight');
    } else {
      this.category.set('Obese');
      this.categoryColor.set('obese');
    }
  }

  private clearResults(): void {
    this.bmi.set(null);
    this.category.set(null);
    this.categoryColor.set('');
  }

  setUnitSystem(system: 'metric' | 'imperial'): void {
    this.unitSystem.set(system);
    this.clearResults();
  }

  getCategoryIcon(): string {
    switch (this.categoryColor()) {
      case 'underweight': return 'trending_down';
      case 'normal': return 'favorite';
      case 'overweight': return 'trending_up';
      case 'obese': return 'warning';
      default: return 'info';
    }
  }

  getCategoryExplanation(): string {
    switch (this.categoryColor()) {
      case 'underweight':
        return 'Your BMI suggests you may be underweight. Consider consulting with a healthcare provider.';
      case 'normal':
        return 'Your BMI is in the healthy range. Maintain your current lifestyle with balanced diet and exercise.';
      case 'overweight':
        return 'Your BMI suggests you may be overweight. Consider a balanced diet and regular physical activity.';
      case 'obese':
        return 'Your BMI indicates obesity. Please consult with a healthcare provider for personalized guidance.';
      default:
        return '';
    }
  }

    scrollToBmiCalculators(): void {
    const element = document.querySelector('.unit-toggle-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

}
