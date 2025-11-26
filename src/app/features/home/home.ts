import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ToolsService } from '../../core/services/tools.service';
import { Tool, ToolCategoryMeta } from '../../core/models/tool.interface';
import { ToolCardComponent } from '../../shared/components/tool-card/tool-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    ToolCardComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  toolsService = inject(ToolsService); // Made public for template access

  featuredTools: Tool[] = [];
  categories: ToolCategoryMeta[] = [];

  // Icon pool for hero visual grid
  private iconPool = [
    'calculate', 'text_fields', 'palette', 'swap_horiz',
    'password', 'qr_code', 'schedule', 'percent',
    'thermostat', 'gradient', 'fingerprint', 'notes'
  ];

  // Value propositions
  benefits = [
    {
      icon: 'lock',
      title: '100% Private',
      description: 'All tools run entirely in your browser. No data is ever sent to any server.'
    },
    {
      icon: 'flash_on',
      title: 'Lightning Fast',
      description: 'Instant results with no loading times. Pure client-side performance.'
    },
    {
      icon: 'smartphone',
      title: 'Mobile Friendly',
      description: 'Responsive design that works beautifully on all devices and screen sizes.'
    },
    {
      icon: 'money_off',
      title: 'Always Free',
      description: 'No subscriptions, no ads, no hidden costs. Free forever.'
    }
  ];

  ngOnInit(): void {
    this.featuredTools = this.toolsService.getFeaturedTools();
    this.categories = this.toolsService.getAllCategories();
  }

  getToolCountForCategory(categoryId: string): number {
    return this.toolsService.getToolCountByCategory(categoryId as any);
  }

  getRandomIcon(index: number): string {
    return this.iconPool[index % this.iconPool.length];
  }
}
