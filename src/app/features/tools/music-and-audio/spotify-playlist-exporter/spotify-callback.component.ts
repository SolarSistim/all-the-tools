import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SpotifyAuthService } from './spotify-auth.service';

@Component({
  selector: 'app-spotify-callback',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatCardModule, MatIconModule],
  template: `
    <div class="callback-container">
      <mat-card class="callback-card">
        <div *ngIf="!error" class="callback-content">
          <mat-spinner></mat-spinner>
          <h2>Connecting to Spotify...</h2>
          <p>Please wait while we complete the authentication.</p>
        </div>
        <div *ngIf="error" class="error-content">
          <mat-icon color="warn">error</mat-icon>
          <h2>Authentication Failed</h2>
          <p>{{ error }}</p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .callback-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: var(--bg-primary);
      padding: 20px;
    }

    .callback-card {
      max-width: 500px;
      width: 100%;
      padding: 40px !important;
      text-align: center;
    }

    .callback-content, .error-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    h2 {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.5rem;
      margin: 0;
      color: var(--text-primary);
    }

    p {
      font-family: 'Space Grotesk', sans-serif;
      color: var(--text-secondary);
      margin: 0;
    }

    mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }
  `]
})
export class SpotifyCallbackComponent implements OnInit {
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: SpotifyAuthService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const code = this.route.snapshot.queryParamMap.get('code');
      const state = this.route.snapshot.queryParamMap.get('state');
      const error = this.route.snapshot.queryParamMap.get('error');

      if (error) {
        this.error = `Authorization failed: ${error}`;
        return;
      }

      if (!code || !state) {
        this.error = 'Missing authorization code or state';
        return;
      }

      await this.authService.handleCallback(code, state);
      this.router.navigate(['/tools/spotify-playlist-export']);
    } catch (err: any) {
      this.error = err.message || 'An error occurred during authentication';
      console.error('Callback error:', err);
    }
  }
}
