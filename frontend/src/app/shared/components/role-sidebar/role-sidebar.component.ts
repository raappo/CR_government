import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-role-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <aside class="flex h-full flex-col bg-ink-900 text-white">
      <div class="border-b border-white/10 px-5 py-6">
        <p class="font-display text-xl font-semibold">Operations Hub</p>
        <p class="mt-1 text-sm text-white/60">{{ authService.currentUser()?.role }} workspace</p>
      </div>
      <nav class="flex-1 space-y-2 px-3 py-4">
        @for (item of menuItems(); track item.path) {
          <a
            [routerLink]="item.path"
            routerLinkActive="bg-white/12 text-white"
            class="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
            (click)="itemSelected.emit()"
          >
            <mat-icon>{{ item.icon }}</mat-icon>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>
    </aside>
  `
})
export class RoleSidebarComponent {
  @Output() readonly itemSelected = new EventEmitter<void>();
  readonly authService = inject(AuthService);

  readonly menuItems = computed(() => {
    switch (this.authService.currentUser()?.role) {
      case 'ADMIN':
        return [
          { label: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
          { label: 'Complaints', path: '/admin/complaints', icon: 'assignment' },
          { label: 'Analytics', path: '/admin/analytics', icon: 'query_stats' }
        ];
      case 'OFFICER':
        return [{ label: 'Assigned Tasks', path: '/officer/tasks', icon: 'task_alt' }];
      default:
        return [
          { label: 'Dashboard', path: '/citizen/dashboard', icon: 'home' },
          { label: 'Raise Complaint', path: '/citizen/raise-complaint', icon: 'add_circle' },
          { label: 'My Complaints', path: '/citizen/my-complaints', icon: 'list_alt' }
        ];
    }
  });
}
