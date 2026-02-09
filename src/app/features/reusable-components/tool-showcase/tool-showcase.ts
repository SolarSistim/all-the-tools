import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Tool } from '../../../core/models/tool.interface';
import { ToolsService } from '../../../core/services/tools.service';

/**
 * Tool Showcase Component
 * Features a specific tool with description and CTA button
 * Used to highlight a tool within article content
 */
@Component({
  selector: 'app-tool-showcase',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './tool-showcase.html',
  styleUrl: './tool-showcase.scss',
})
export class ToolShowcaseComponent implements OnInit {
  @Input({ required: true }) toolId!: string;
  @Input() customDescription?: string;
  @Input() showCTA = true;

  tool: Tool | null = null;

  constructor(private toolsService: ToolsService) {}

  ngOnInit(): void {
    const foundTool = this.toolsService.getToolById(this.toolId);
    this.tool = foundTool || null;
  }
}
