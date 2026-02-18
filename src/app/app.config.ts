import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { NavigationError, provideRouter, withNavigationErrorHandler } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

function handleChunkLoadError(e: NavigationError): void {
  if (typeof window === 'undefined') return;
  const msg: string = e.error?.message ?? '';
  const isChunkError = e.error instanceof TypeError && (
    msg.includes('dynamically imported module') ||
    msg.includes('module script')
  );
  if (!isChunkError) return;
  // Use sessionStorage to prevent infinite reload loops at the same URL
  const storageKey = `chunk_reload_${e.url}`;
  if (!sessionStorage.getItem(storageKey)) {
    sessionStorage.setItem(storageKey, '1');
    // Full page load to the INTENDED destination (not reload of current page)
    // This fetches fresh index.html + new bundles, breaking the stale-cache cycle
    window.location.href = e.url;
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withNavigationErrorHandler(handleChunkLoadError)),
    provideAnimations(),
    provideHttpClient(withFetch()),
    provideClientHydration()
  ]
};
