import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { finalize } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ComplaintService } from '../services/complaint.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-raise-complaint',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  template: `
    <mat-card class="rounded-[1.75rem] border border-slate-200 !shadow-none">
      <mat-card-content class="p-6">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-sm uppercase tracking-[0.2em] text-civic-700">Complaint form</p>
            <h1 class="mt-2 font-display text-3xl font-bold text-ink-900">Raise a new civic grievance</h1>
          </div>
          <button mat-stroked-button type="button" (click)="captureLocation()">Capture location</button>
        </div>

        <form class="mt-8 grid gap-5 lg:grid-cols-2" [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline">
            <mat-label>Title</mat-label>
            <input matInput formControlName="title" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Category</mat-label>
            <mat-select formControlName="category">
              @for (category of categories; track category) {
                <mat-option [value]="category">{{ category }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Priority</mat-label>
            <mat-select formControlName="priority">
              <mat-option value="LOW">Low</mat-option>
              <mat-option value="MEDIUM">Medium</mat-option>
              <mat-option value="HIGH">High</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Upload image URL</mat-label>
            <input matInput formControlName="imageUrl" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="lg:col-span-2">
            <mat-label>Description</mat-label>
            <textarea matInput rows="5" formControlName="description"></textarea>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Latitude</mat-label>
            <input matInput type="number" formControlName="latitude" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Longitude</mat-label>
            <input matInput type="number" formControlName="longitude" />
          </mat-form-field>
          <div class="lg:col-span-2 flex justify-end">
            <button mat-flat-button color="primary" class="!rounded-xl !px-6 !py-6" [disabled]="form.invalid || submitting()">
              Submit complaint
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `
})
export class RaiseComplaintComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly complaintService = inject(ComplaintService);
  private readonly notificationService = inject(NotificationService);

  readonly submitting = signal(false);
  readonly categories = ['Solid Waste', 'Roads & Mobility', 'Water Supply', 'Street Lighting', 'Parks & Public Spaces'];

  readonly form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    category: ['Solid Waste', Validators.required],
    priority: ['MEDIUM', Validators.required],
    imageUrl: [''],
    latitude: [12.9716],
    longitude: [77.5946]
  });

  captureLocation(): void {
    if (!navigator.geolocation) {
      this.notificationService.error('Geolocation is not supported on this device.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.form.patchValue({
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6))
        });
        this.notificationService.success('Location captured successfully');
      },
      () => this.notificationService.error('Unable to fetch location. You can enter coordinates manually.')
    );
  }

  submit(): void {
    if (this.form.invalid || !this.authService.currentUser()) {
      return;
    }

    this.submitting.set(true);
    const payload = this.form.getRawValue();
    this.complaintService
      .createComplaint({
        title: payload.title ?? '',
        description: payload.description ?? '',
        category: payload.category ?? 'Solid Waste',
        priority: (payload.priority ?? 'MEDIUM') as 'LOW' | 'MEDIUM' | 'HIGH',
        imageUrl: payload.imageUrl ?? '',
        latitude: payload.latitude ?? undefined,
        longitude: payload.longitude ?? undefined,
        citizenId: this.authService.currentUser()!.id,
        citizenName: this.authService.currentUser()!.name
      })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.notificationService.success('Complaint submitted successfully');
          this.form.reset({ category: 'Solid Waste', priority: 'MEDIUM', latitude: 12.9716, longitude: 77.5946, imageUrl: '' });
        },
        error: () => this.notificationService.error('Unable to submit complaint right now.')
      });
  }
}
