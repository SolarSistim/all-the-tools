import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

class ChunkLoadErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    const isChunkError = error instanceof TypeError &&
      error.message.includes('Failed to fetch dynamically imported module');
    if (isChunkError && typeof window !== 'undefined') {
      window.location.reload();
      return;
    }
    console.error(error);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withFetch()),
    provideClientHydration(),
    { provide: ErrorHandler, useClass: ChunkLoadErrorHandler }
  ]
};
