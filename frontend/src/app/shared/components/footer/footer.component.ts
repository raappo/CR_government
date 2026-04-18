import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <footer class="border-t border-slate-200 bg-white">
      <div class="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <p class="font-display text-lg font-semibold text-ink-900">Citizen-first service delivery</p>
          <p class="mt-3 text-sm text-ink-700">
            Unified complaint intake, SLA tracking, and municipal response management for smarter cities.
          </p>
        </div>
        <div>
          <p class="font-semibold text-ink-900">Contact</p>
          <p class="mt-3 text-sm text-ink-700">helpdesk&#64;smartcivic.gov</p>
          <p class="text-sm text-ink-700">1800-425-2026</p>
        </div>
        <div>
          <p class="font-semibold text-ink-900">About</p>
          <p class="mt-3 text-sm text-ink-700">Departments</p>
          <p class="text-sm text-ink-700">Transparency portal</p>
          <p class="text-sm text-ink-700">Citizen charter</p>
        </div>
        <div>
          <p class="font-semibold text-ink-900">Social</p>
          <div class="mt-3 flex gap-3 text-ink-700">
            <mat-icon>public</mat-icon>
            <mat-icon>campaign</mat-icon>
            <mat-icon>share</mat-icon>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
