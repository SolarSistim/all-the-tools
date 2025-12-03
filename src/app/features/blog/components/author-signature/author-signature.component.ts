import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Author } from '../../models/blog.models';

/**
 * Author Signature Component
 * Displays author bio and social links at the end of articles
 */
@Component({
  selector: 'app-author-signature',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './author-signature.component.html',
  styleUrls: ['./author-signature.component.scss'],
})
export class AuthorSignatureComponent {
  @Input({ required: true }) author!: Author;
  @Input() showFullBio: boolean = true;
}
