import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Tool } from '../../../core/models/tool.interface';
import { ToolsService } from '../../../core/services/tools.service';
import { ContentMatchingService } from '../../../core/services/content-matching.service';

/**
 * Related Tools Component
 * Displays related tools inline within article content
 * Supports both explicit tool IDs and automatic tag-based matching
 */
@Component({
  selector: 'app-related-tools',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './related-tools.html',
  styleUrl: './related-tools.scss',
})
export class RelatedToolsComponent implements OnInit {
  @Input() toolIds?: string[];
  @Input() auto = false;
  @Input() limit = 3;
  @Input() title = 'Related Tools';
  @Input() currentArticleTags?: string[];
  @Input() currentArticleCategory?: string;

  displayTools: Tool[] = [];

  constructor(
    private toolsService: ToolsService,
    private contentMatchingService: ContentMatchingService
  ) {}

  ngOnInit(): void {
    if (this.toolIds && this.toolIds.length > 0) {
      // Use explicit tool IDs
      this.displayTools = this.toolsService.getToolsByIds(this.toolIds);
    } else if (this.auto && this.currentArticleTags) {
      // Auto-generate based on tags
      this.displayTools = this.contentMatchingService.findRelatedTools(
        this.currentArticleTags,
        this.currentArticleCategory,
        this.limit
      );
    }
  }
}
