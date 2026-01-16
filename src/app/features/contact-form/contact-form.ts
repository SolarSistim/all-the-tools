import { Component, signal, computed, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

// Extend Window interface to include grecaptcha
declare global {
  interface Window {
    grecaptcha: any;
    onRecaptchaLoad: () => void;
  }
}

@Component({
  selector: 'app-contact-form',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
})
export class ContactForm implements OnInit {
  private platformId = inject(PLATFORM_ID);

  // Form fields
  firstName = signal('');
  lastName = signal('');
  phone = signal('');
  email = signal('');
  message = signal('');

  // State management
  isSubmitted = signal(false);
  isLoading = signal(false);
  recaptchaToken = signal<string | null>(null);
  recaptchaLoaded = signal(false);

  // reCAPTCHA site key (you'll need to replace this with your actual site key)
  readonly RECAPTCHA_SITE_KEY = '6Le_BCAsAAAAAJRWW_CEA6aQvxIvy8AJiaZg5Ako'; // Test key - replace with your actual key

  // Computed property for email validation
  isEmailValid = computed(() => {
    const emailValue = this.email().trim();
    if (!emailValue || emailValue.length === 0) {
      return false;
    }
    return this.isValidEmail(emailValue);
  });

  // Form validation - email is required
  isFormValid = computed(() => {
    return this.isEmailValid();
  });

  // Button should be disabled if form is not valid, recaptcha not completed, or loading
  isButtonDisabled = computed(() => {
    return !this.isFormValid() || !this.recaptchaToken() || this.isLoading();
  });

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadRecaptchaScript();
    }
  }

  /**
   * Load the Google reCAPTCHA script
   */
  private loadRecaptchaScript(): void {
    if (window.grecaptcha) {
      this.recaptchaLoaded.set(true);
      this.renderRecaptcha();
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit';
    script.async = true;
    script.defer = true;

    // Set up callback
    window.onRecaptchaLoad = () => {
      this.recaptchaLoaded.set(true);
      this.renderRecaptcha();
    };

    document.head.appendChild(script);
  }

  /**
   * Render the reCAPTCHA widget
   */
  private renderRecaptcha(): void {
    setTimeout(() => {
      const recaptchaContainer = document.getElementById('recaptcha-container');
      if (recaptchaContainer && window.grecaptcha) {
        try {
          window.grecaptcha.render(recaptchaContainer, {
            sitekey: this.RECAPTCHA_SITE_KEY,
            callback: (token: string) => {
              this.recaptchaToken.set(token);
            },
            'expired-callback': () => {
              this.recaptchaToken.set(null);
            },
            'error-callback': () => {
              this.recaptchaToken.set(null);
            }
          });
        } catch (error) {
          console.error('Error rendering reCAPTCHA:', error);
        }
      }
    }, 100);
  }

  /**
   * Submit the contact form
   */
  async onSubmit(): Promise<void> {
    if (!this.isFormValid() || !this.recaptchaToken()) {
      return;
    }

    this.isLoading.set(true);

    try {
      // Collect submission data
      const submissionData = {
        firstName: this.firstName().trim(),
        lastName: this.lastName().trim(),
        phone: this.phone().trim(),
        email: this.email().trim(),
        message: this.message().trim(),
        recaptchaToken: this.recaptchaToken(),
        // Additional tracking data for Google Sheets
        sessionId: this.getSessionId(),
        deviceType: this.getDeviceType(),
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
      };

      // Call Netlify function to submit contact form
      const response = await fetch('/.netlify/functions/submit-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit contact form');
      }

      const result = await response.json();
      console.log('Contact form submitted successfully:', result);

      this.isLoading.set(false);
      this.isSubmitted.set(true);

      // Reset form after 5 seconds
      setTimeout(() => {
        this.resetForm();
      }, 5000);

    } catch (error) {
      console.error('Error submitting contact form:', error);
      this.isLoading.set(false);
      alert('Sorry, there was an error submitting your message. Please try again later.');
    }
  }

  /**
   * Reset the form to initial state
   */
  private resetForm(): void {
    this.firstName.set('');
    this.lastName.set('');
    this.phone.set('');
    this.email.set('');
    this.message.set('');
    this.recaptchaToken.set(null);
    this.isSubmitted.set(false);

    // Reset reCAPTCHA
    if (window.grecaptcha) {
      try {
        window.grecaptcha.reset();
      } catch (error) {
        console.error('Error resetting reCAPTCHA:', error);
      }
    }
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  /**
   * Get or create a session ID
   */
  private getSessionId(): string {
    const storageKey = 'visitor_session_id';

    try {
      let sessionId = sessionStorage.getItem(storageKey);

      if (!sessionId) {
        sessionId = this.generateSessionId();
        sessionStorage.setItem(storageKey, sessionId);
      }

      return sessionId;
    } catch (error) {
      // If sessionStorage is not available, generate a temporary ID
      return this.generateSessionId();
    }
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Detect device type
   */
  private getDeviceType(): string {
    const ua = navigator.userAgent;

    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'Tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'Mobile';
    }
    return 'Desktop';
  }
}
