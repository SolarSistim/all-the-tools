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
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
