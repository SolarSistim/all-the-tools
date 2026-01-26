import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { Tool } from '../../../core/models/tool.interface';

@Component({
  selector: 'app-tool-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule
  ],
  templateUrl: './tool-card.html',
  styleUrl: './tool-card.scss'
})
export class ToolCardComponent {
  @Input({ required: true }) tool!: Tool;
  @Input() featured = false;
  @Output() cardClick = new EventEmitter<Tool>();

  private categoryMap: Record<string, { name: string; icon: string }> = {
    math: { name: 'Math', icon: 'calculate' },
    converter: { name: 'Converter', icon: 'swap_horiz' },
    text: { name: 'Text', icon: 'text_fields' },
    generator: { name: 'Generator', icon: 'auto_awesome' },
    color: { name: 'Color', icon: 'palette' },
    time: { name: 'Time', icon: 'access_time' },
    other: { name: 'Other', icon: 'more_horiz' }
  };

  /**
   * Get router link array for the tool
   * Handles multi-segment routes by splitting on '/'
   */
  get routerLinkArray(): string[] {
    if (this.tool.route.includes('/')) {
      // Split multi-segment routes (e.g., 'unit-converter/cm-to-inches')
      return ['/tools', ...this.tool.route.split('/')];
    }
    // Single segment route
    return ['/tools', this.tool.route];
  }

  onCardClick(): void {
    this.cardClick.emit(this.tool);
  }

  getCategoryName(category: string): string {
    return this.categoryMap[category]?.name || category;
  }

  getCategoryIcon(category: string): string {
    return this.categoryMap[category]?.icon || 'more_horiz';
  }
}
