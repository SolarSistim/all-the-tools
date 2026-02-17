import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../core/services/auth.service';
import { LoginDialogComponent } from '../auth/login-dialog/login-dialog.component';

@Component({
  selector: 'app-why-sign-up',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="page-container">

      <!-- Hero -->
      <section class="hero">
        <div class="hero-glow"></div>
        <div class="hero-content">
          <div class="hero-badge">
            <mat-icon>auto_awesome</mat-icon>
            <span>Free forever</span>
          </div>
          <h1>Sign up once.<br>Never see an ad again.</h1>
          <p class="hero-subtitle">
            Creating a free account on AllTheThings.dev permanently removes all advertising — on every page, every tool, every article. No subscription. No credit card. No catch.
          </p>
          @if (!(isAuthenticated$ | async)) {
            <button mat-raised-button class="cta-btn" (click)="openLogin()">
              <mat-icon>login</mat-icon>
              Create free account
            </button>
          } @else {
            <div class="already-signed-in">
              <mat-icon>check_circle</mat-icon>
              <span>You're already signed in — enjoy the ad-free experience!</span>
            </div>
          }
        </div>
      </section>

      <!-- Benefits grid -->
      <section class="benefits">
        <div class="benefits-grid">

          <div class="benefit-card">
            <div class="benefit-icon">
              <mat-icon>block</mat-icon>
            </div>
            <h3>Zero ads, everywhere</h3>
            <p>Every page, every tool, every blog article. No banners, no pop-ups, no autoplaying video ads. Just the content you came for.</p>
          </div>

          <div class="benefit-card">
            <div class="benefit-icon">
              <mat-icon>notifications_active</mat-icon>
            </div>
            <h3>News & updates feed</h3>
            <p>Get notified when new tools launch, articles are published, or maintenance is scheduled — right in your account dashboard.</p>
          </div>

          <div class="benefit-card">
            <div class="benefit-icon">
              <mat-icon>speed</mat-icon>
            </div>
            <h3>Faster page loads</h3>
            <p>No ad scripts to load means pages render noticeably faster. Especially on slower connections and mobile devices.</p>
          </div>

          <div class="benefit-card">
            <div class="benefit-icon">
              <mat-icon>security</mat-icon>
            </div>
            <h3>No tracking</h3>
            <p>Ad networks track your behaviour across the web. Remove the ads and you remove the trackers that come with them.</p>
          </div>

          <div class="benefit-card">
            <div class="benefit-icon">
              <mat-icon>volunteer_activism</mat-icon>
            </div>
            <h3>Support the site</h3>
            <p>AllTheThings.dev is built and maintained by one person. Creating an account helps us understand who actually uses the site.</p>
          </div>

          <div class="benefit-card">
            <div class="benefit-icon">
              <mat-icon>lock_open</mat-icon>
            </div>
            <h3>Always free</h3>
            <p>There is no paid tier, no premium plan, no upsell. An account is and will always be free. Sign in with Google or GitHub — done in seconds.</p>
          </div>

        </div>
      </section>

      <!-- Bottom CTA -->
      @if (!(isAuthenticated$ | async)) {
        <section class="bottom-cta">
          <h2>Ready to ditch the ads?</h2>
          <p>Sign in with Google or GitHub — it takes about 10 seconds.</p>
          <button mat-raised-button class="cta-btn" (click)="openLogin()">
            <mat-icon>login</mat-icon>
            Create free account
          </button>
        </section>
      }

    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 2rem 1rem 4rem;
    }

    /* ── Hero ── */
    .hero {
      position: relative;
      text-align: center;
      padding: 4rem 1rem 3rem;
      overflow: hidden;

      .hero-glow {
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse 70% 60% at 50% 0%, rgba(109, 212, 255, 0.12) 0%, transparent 70%);
        pointer-events: none;
      }

      .hero-content {
        position: relative;
        z-index: 1;
      }

      .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        background: rgba(109, 212, 255, 0.12);
        border: 1px solid rgba(109, 212, 255, 0.3);
        border-radius: 100px;
        padding: 0.3rem 0.9rem;
        margin-bottom: 1.5rem;
        font-size: 0.85rem;
        color: var(--neon-cyan);
        font-weight: 600;

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }

      h1 {
        font-size: clamp(2rem, 5vw, 3.25rem);
        font-weight: 700;
        line-height: 1.15;
        margin: 0 0 1.25rem;
        background: linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-pink) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .hero-subtitle {
        font-size: 1.15rem;
        color: var(--text-secondary);
        line-height: 1.7;
        max-width: 620px;
        margin: 0 auto 2rem;
      }
    }

    .cta-btn {
      font-weight: 600;
      font-size: 1rem;
      height: 48px;
      padding: 0 2rem !important;
      background: linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-pink) 100%) !important;
      color: white !important;
      border: none !important;
      box-shadow: 0 4px 15px var(--neon-cyan-glow) !important;
      transition: all 0.3s ease !important;
      text-transform: none;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px var(--neon-cyan-glow), 0 0 30px var(--neon-pink-glow) !important;
      }

      mat-icon { margin-right: 6px; }
    }

    .already-signed-in {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--neon-cyan);
      font-weight: 500;
      font-size: 1rem;

      mat-icon { font-size: 20px; width: 20px; height: 20px; }
    }

    /* ── Benefits grid ── */
    .benefits {
      padding: 2rem 0;
    }

    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .benefit-card {
      background: var(--bg-elevated);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 1.75rem;
      transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;

      &:hover {
        border-color: var(--neon-cyan);
        transform: translateY(-4px);
        box-shadow: 0 8px 24px var(--shadow-color);
      }

      .benefit-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: rgba(109, 212, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;

        mat-icon {
          color: var(--neon-cyan);
          font-size: 24px;
          width: 24px;
          height: 24px;
        }
      }

      h3 {
        margin: 0 0 0.5rem;
        font-size: 1.05rem;
        font-weight: 600;
        color: var(--text-primary);
      }

      p {
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.65;
        color: var(--text-secondary);
      }
    }

    /* ── Bottom CTA ── */
    .bottom-cta {
      text-align: center;
      padding: 3rem 1rem 1rem;

      h2 {
        font-size: 1.75rem;
        font-weight: 700;
        margin: 0 0 0.75rem;
        color: var(--text-primary);
      }

      p {
        color: var(--text-secondary);
        margin: 0 0 1.5rem;
        font-size: 1rem;
      }
    }
  `]
})
export class WhySignUpComponent {
  private dialog = inject(MatDialog);
  isAuthenticated$ = inject(AuthService).isAuthenticated$;

  openLogin(): void {
    this.dialog.open(LoginDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
      panelClass: 'login-dialog-container',
      backdropClass: 'glass-dialog-backdrop'
    });
  }
}
