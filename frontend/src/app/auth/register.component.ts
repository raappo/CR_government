import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  template: `
    <div class="min-h-screen bg-slate-100 px-4 py-12">
      <div class="mx-auto max-w-3xl">
        <mat-card class="rounded-[2rem] border border-slate-200 !shadow-civic">
          <mat-card-content class="p-8">
            <p class="text-sm uppercase tracking-[0.2em] text-civic-700">Citizen onboarding</p>
            <h1 class="mt-3 font-display text-3xl font-bold text-ink-900">Register your civic services account</h1>

            <form class="mt-8 grid gap-5 md:grid-cols-2" [formGroup]="form" (ngSubmit)="submit()">
              <mat-form-field appearance="outline">
                <mat-label>Full name</mat-label>
                <input matInput formControlName="name" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Password</mat-label>
                <input matInput type="password" formControlName="password" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Role</mat-label>
                <mat-select formControlName="role">
                  <mat-option value="CITIZEN">Citizen</mat-option>
                  <mat-option value="OFFICER">Officer</mat-option>
                  <mat-option value="ADMIN">Admin</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Contact number</mat-label>
                <input matInput formControlName="contactNumber" />
              </mat-form-field>
              <mat-form-field appearance="outline" class="md:col-span-2">
                <mat-label>Address</mat-label>
                <textarea matInput rows="4" formControlName="address"></textarea>
              </mat-form-field>

              <div class="md:col-span-2 flex flex-wrap items-center justify-between gap-4">
                <a routerLink="/login" class="text-sm font-medium text-civic-700">Already registered? Login</a>
                <button mat-flat-button color="primary" class="!rounded-xl !px-6 !py-6" [disabled]="form.invalid || submitting()">
                  Create account
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  readonly submitting = signal(false);

  readonly form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    role: ['CITIZEN', Validators.required],
    contactNumber: ['', Validators.required],
    address: ['', Validators.required]
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.submitting.set(true);
    this.authService
      .register(this.form.getRawValue() as never)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: async (user) => {
          this.notificationService.success('Registration complete');
          await this.authService.redirectForRole(user.role);
        },
        error: () => this.notificationService.error('Registration failed. Please review your details.')
      });
  }
}
