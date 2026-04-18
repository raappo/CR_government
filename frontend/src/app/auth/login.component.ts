import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule],
  template: `
    <div class="min-h-screen bg-[linear-gradient(135deg,#0f1d31,#163f62,#0f8f79)] px-4 py-12">
      <div class="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_460px]">
        <div class="hidden rounded-[2rem] border border-white/10 bg-white/10 p-10 text-white shadow-civic backdrop-blur lg:block">
          <p class="text-sm uppercase tracking-[0.2em] text-civic-200">Secure access</p>
          <h1 class="mt-4 font-display text-4xl font-bold">Role-based login for citizens, officers, and admins</h1>
          <p class="mt-4 max-w-xl text-white/75">Use demo accounts like citizen&#64;civic.local, officer&#64;civic.local, or admin&#64;civic.local if your backend is not running.</p>
        </div>

        <mat-card class="rounded-[2rem] !shadow-civic">
          <mat-card-content class="p-8">
            <div class="flex items-center gap-3">
              <img src="assets/logo.svg" alt="logo" class="h-12 w-12 rounded-2xl" />
              <div>
                <p class="font-display text-2xl font-bold text-ink-900">Welcome back</p>
                <p class="text-sm text-ink-600">Sign in to continue managing civic issues</p>
              </div>
            </div>

            <form class="mt-8 space-y-5" [formGroup]="form" (ngSubmit)="submit()">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Password</mat-label>
                <input matInput [type]="hidePassword() ? 'password' : 'text'" formControlName="password" />
                <button mat-icon-button matSuffix type="button" (click)="hidePassword.set(!hidePassword())">
                  <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
              </mat-form-field>

              <button mat-flat-button color="primary" class="w-full !rounded-xl !py-6" [disabled]="form.invalid || submitting()">
                Login
              </button>
            </form>

            <p class="mt-6 text-center text-sm text-ink-600">
              New here?
              <a routerLink="/register" class="font-semibold text-civic-700">Create an account</a>
            </p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  readonly submitting = signal(false);
  readonly hidePassword = signal(true);

  readonly form = this.fb.group({
    email: ['citizen@civic.local', [Validators.required, Validators.email]],
    password: ['password123', Validators.required]
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.submitting.set(true);
    this.authService
      .login(this.form.getRawValue() as { email: string; password: string })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: async (user) => {
          this.notificationService.success('Logged in successfully');
          await this.authService.redirectForRole(user.role);
        },
        error: () => this.notificationService.error('Unable to login. Please try again.')
      });
  }
}
