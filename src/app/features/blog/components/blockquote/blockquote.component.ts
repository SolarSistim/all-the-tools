import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockquoteBlock } from '../../models/blog.models';

/**
 * Blockquote Component
 * Displays styled blockquotes with optional citations
 */
@Component({
  selector: 'app-blockquote',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blockquote.component.html',
  styleUrls: ['./blockquote.component.scss'],
})
export class BlockquoteComponent {
  @Input({ required: true }) data!: BlockquoteBlock['data'];
}
