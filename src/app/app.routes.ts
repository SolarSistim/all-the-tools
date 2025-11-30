import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'All The Tools - Your Swiss Army Knife of Web Utilities'
  },
  {
    path: 'tools',
    loadComponent: () => import('./features/tools/tools').then(m => m.ToolsComponent),
    title: 'All Tools - Browse Our Collection'
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about').then(m => m.AboutComponent),
    title: 'About - All The Tools'
  },
  {
    path: 'privacy',
    loadComponent: () => import('./features/privacy/privacy').then(m => m.PrivacyComponent),
    title: 'Privacy Policy - All The Tools'
  },
  {
    path: 'terms',
    loadComponent: () => import('./features/terms/terms').then(m => m.TermsComponent),
    title: 'Terms of Service - All The Tools'
  },
  {
    path: 'accessibility',
    loadComponent: () => import('./features/accessibility/accessibility').then(m => m.AccessibilityComponent),
    title: 'Accessibility Statement - All The Tools'
  },
  {
    path: 'changelog',
    loadComponent: () => import('./features/changelog/changelog').then(m => m.Changelog),
    title: 'Changelog - All The Tools'
  },
  {
    path: 'tools/percentage-calculator',
    loadComponent: () => import('./features/tools/math-and-calculators/percentage-calculator/percentage-calculator').then(m => m.PercentageCalculatorComponent),
    title: 'Percentage Calculator - All The Tools'
  },
  {
    path: 'presskit',
    loadComponent: () => import('./features/presskit/presskit').then(m => m.Presskit),
    title: 'All The Tools - Presskit'
  },
  {
    path: 'tools/tip-calculator',
    loadComponent: () => import('./features/tools/math-and-calculators/tip-calculator/tip-calculator').then(m => m.TipCalculator),
    title: 'Tip Calculator - All The Tools'
  },
  {
    path: 'tools/bmi-calculator',
    loadComponent: () => import('./features/tools/math-and-calculators/body-mass-index-calculator/body-mass-index-calculator').then(m => m.BodyMassIndexCalculator),
    title: 'BMI Calculator - All The Tools'
  },
  {
    path: 'tools/unit-converter',
    loadComponent: () => import('./features/tools/converters/unit-converter/unit-converter').then(m => m.UnitConverter),
    title: 'Unit Converter - All The Tools'
  },
  {
    path: 'tools/word-counter',
    loadComponent: () => import('./features/tools/text-tools/word-counter/word-counter').then(m => m.WordCounter),
    title: 'Word Counter - All The Tools'
  },
  {
    path: 'tools/case-converter',
    loadComponent: () => import('./features/tools/text-tools/case-converter/case-converter').then(m => m.CaseConverter),
    title: 'Word Counter - All The Tools'
  },
  {
    path: 'tools/lorem-ipsum',
    loadComponent: () => import('./features/tools/generators/lorem-ipsum/lorem-ipsum').then(m => m.LoremIpsum),
    title: 'Lorem Ipsum Generator - All The Tools'
  },
  {
    path: 'tools/password-generator',
    loadComponent: () => import('./features/tools/generators/password-generator/password-generator').then(m => m.PasswordGenerator),
    title: 'Password Generator - All The Tools'
  },
  {
    path: 'tools/qr-code-generator',
    loadComponent: () => import('./features/tools/generators/qr-code-generator/qr-code-generator').then(m => m.QrCodeGenerator),
    title: 'QR Code Generator - All The Tools'
  },
  {
    path: 'tools/uuid-generator',
    loadComponent: () => import('./features/tools/generators/uuid-generator/uuid-generator').then(m => m.UuidGenerator),
    title: 'UUID Generator'
  },
  {
    path: 'tools/color-picker',
    loadComponent: () => import('./features/tools/color-tools/color-picker/color-picker').then(m => m.ColorPicker),
    title: 'Color Picker - All The Tools'
  },
  {
    path: 'tools/gradient-generator',
    loadComponent: () => import('./features/tools/color-tools/gradient-generator/gradient-generator').then(m => m.GradientGenerator),
    title: 'Gradient Generator - All The Tools'
  },
  {
    path: 'tools/timestamp-converter',
    loadComponent: () => import('./features/tools/time-and-date/timestamp-converter/timestamp-converter').then(m => m.TimestampConverter),
    title: 'Timestamp Converter - All The Tools'
  },
  {
    path: 'tools/time-zone-converter',
    loadComponent: () => import('./features/tools/time-and-date/timezone-converter/timezone-converter').then(m => m.TimezoneConverter),
    title: 'TImezone Converter - All The Tools'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
