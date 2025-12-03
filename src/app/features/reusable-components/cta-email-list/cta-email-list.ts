import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-cta-email-list',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule
  ],
  templateUrl: './cta-email-list.html',
  styleUrl: './cta-email-list.scss',
})
export class CtaEmailList {
  /**
   * Background color for dark theme only
   * Options: 'primary' or 'secondary'
   * Default: 'secondary'
   */
  @Input() darkThemeBg: 'primary' | 'secondary' = 'secondary';

  email = signal('');
  isSubmitted = signal(false);
  isLoading = signal(false);

  // Computed property for email validation
  isEmailValid = computed(() => {
    const emailValue = this.email().trim();
    if (!emailValue || emailValue.length === 0) {
      return false;
    }
    return this.isValidEmail(emailValue);
  });

  // Tooltip message for the button
  tooltipMessage = computed(() => {
    const emailValue = this.email().trim();
    if (!emailValue || emailValue.length === 0) {
      return 'Please enter an email address';
    }
    if (!this.isEmailValid()) {
      return 'Please enter a valid email address';
    }
    return '';
  });

  // Button should be disabled if email is not valid or loading
  isButtonDisabled = computed(() => {
    return !this.isEmailValid() || this.isLoading();
  });

  async onSubmit(): Promise<void> {
    if (!this.isEmailValid()) {
      return; // Prevent submission if email is invalid
    }

    if (this.email() && this.isValidEmail(this.email().trim())) {
      this.isLoading.set(true);

      try {
        // Collect submission data
        const submissionData = {
          email: this.email().trim(),
          referrer: document.referrer || 'Direct',
          urlPath: window.location.pathname,
        };

        // Call Netlify function to submit email
        const response = await fetch('/.netlify/functions/submit-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData),
        });

        if (!response.ok) {
          throw new Error('Failed to submit email');
        }

        const result = await response.json();
        console.log('Email submitted successfully:', result);

        this.isLoading.set(false);
        this.isSubmitted.set(true);

        // Reset after 5 seconds
        setTimeout(() => {
          this.isSubmitted.set(false);
          this.email.set('');
        }, 5000);

      } catch (error) {
        console.error('Error submitting email:', error);
        this.isLoading.set(false);
        // Optionally show an error message to the user
        alert('Sorry, there was an error submitting your email. Please try again later.');
      }
    }
  }

  private isValidEmail(email: string): boolean {
    // Strict email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
}