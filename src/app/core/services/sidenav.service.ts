import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private toolsSidenav: MatSidenav | null = null;

  /**
   * Register the tools sidenav so it can be controlled
   */
  registerSidenav(sidenav: MatSidenav): void {
    this.toolsSidenav = sidenav;
  }

  /**
   * Toggle tools sidenav
   */
  toggleToolsSidenav(): void {
    this.toolsSidenav?.toggle();
  }

  /**
   * Close tools sidenav
   */
  closeToolsSidenav(): void {
    this.toolsSidenav?.close();
  }

  /**
   * Open tools sidenav
   */
  openToolsSidenav(): void {
    this.toolsSidenav?.open();
  }

  /**
   * Check if tools sidenav is open
   */
  isOpen(): boolean {
    return this.toolsSidenav?.opened ?? false;
  }
}
