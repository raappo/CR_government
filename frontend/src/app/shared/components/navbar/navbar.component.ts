import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatButtonModule, MatIconModule],
  template: `
    <header class="sticky top-0 z-40 border-b border-white/15 bg-ink-900/90 backdrop-blur-xl text-white">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a routerLink="/" class="flex items-center gap-3">
          <img src="assets/logo.svg" alt="Civic logo" class="h-11 w-11 rounded-2xl bg-white/10 p-2" />
          <div>
            <p class="font-display text-lg font-semibold tracking-tight">Smart Civic Services</p>
            <p class="text-xs text-white/70">Municipal grievance resolution</p>
          </div>
        </a>

        <nav class="hidden items-center gap-2 md:flex">
          @for (link of publicLinks; track link.path) {
            <a
              [routerLink]="link.path"
              routerLinkActive="bg-white/10 text-white"
              class="rounded-full px-4 py-2 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              {{ link.label }}
            </a>
          }
        </nav>

        <div class="hidden items-center gap-3 md:flex">
          @if (authService.currentUser(); as user) {
            <div class="rounded-full border border-white/15 px-4 py-2 text-sm">{{ user.name }} · {{ user.role }}</div>
            <button mat-flat-button color="primary" (click)="authService.logout()">Logout</button>
          } @else {
            <a mat-button routerLink="/login">Login</a>
            <a mat-flat-button color="primary" routerLink="/register">Register</a>
          }
        </div>

        <button class="inline-flex rounded-full border border-white/15 p-2 md:hidden" (click)="menuToggle.emit()">
          <mat-icon>menu</mat-icon>
        </button>
      </div>
    </header>
  `
})
export class NavbarComponent {
  @Output() readonly menuToggle = new EventEmitter<void>();

  readonly authService = inject(AuthService);
  readonly publicLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/' },
    { label: 'Services', path: '/' }
  ];
}
