import { CommonModule } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ViewChild, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { map } from 'rxjs';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { RoleSidebarComponent } from '../role-sidebar/role-sidebar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatSidenavModule, NavbarComponent, FooterComponent, RoleSidebarComponent],
  template: `
    <app-navbar (menuToggle)="drawer.toggle()" />
    <mat-sidenav-container class="min-h-[calc(100vh-73px)] bg-slate-50">
      <mat-sidenav #drawer class="w-72 border-r border-slate-200" [mode]="(isDesktop$ | async) ? 'side' : 'over'" [opened]="(isDesktop$ | async) ?? false">
        <app-role-sidebar (itemSelected)="drawer.close()" />
      </mat-sidenav>

      <mat-sidenav-content>
        <main class="mx-auto min-h-[calc(100vh-73px)] max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <router-outlet />
        </main>
        <app-footer />
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      @media (max-width: 1023px) {
        mat-sidenav {
          width: 18rem;
        }
      }
    `
  ]
})
export class AppShellComponent {
  @ViewChild('drawer') drawer?: MatSidenav;

  private readonly breakpointObserver = inject(BreakpointObserver);
  readonly isDesktop$ = this.breakpointObserver.observe('(min-width: 1024px)').pipe(map((state) => state.matches));
}
