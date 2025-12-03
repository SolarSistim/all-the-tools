import { Component, signal, computed } from '@angular/core';
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

  onSubmit(): void {
    if (!this.isEmailValid()) {
      return; // Prevent submission if email is invalid
    }
    
    if (this.email() && this.isValidEmail(this.email().trim())) {
      this.isLoading.set(true);
      
      // Simulate API call delay
      setTimeout(() => {
        this.isLoading.set(false);
        this.isSubmitted.set(true);
        
        // TODO: Implement actual API call here
        console.log('Email submitted:', this.email());
        
        // Reset after 5 seconds (optional)
        setTimeout(() => {
          this.isSubmitted.set(false);
          this.email.set('');
        }, 5000);
      }, 800);
    }
  }

  private isValidEmail(email: string): boolean {
    // Strict email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
}