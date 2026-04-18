import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { ComplaintService } from '../services/complaint.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule],
  template: `
    <mat-card class="rounded-[1.75rem] border border-slate-200 !shadow-none">
      <mat-card-content class="p-6">
        <p class="text-sm uppercase tracking-[0.2em] text-civic-700">Citizen feedback</p>
        <h1 class="mt-2 font-display text-3xl font-bold text-ink-900">Rate the resolution experience</h1>

        <form class="mt-8 space-y-5" [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Rating (1 to 5)</mat-label>
            <input matInput type="number" min="1" max="5" formControlName="rating" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Comments</mat-label>
            <textarea matInput rows="5" formControlName="comments"></textarea>
          </mat-form-field>
          <button mat-flat-button color="primary" class="!rounded-xl !px-6 !py-6" [disabled]="form.invalid || saving()">Submit feedback</button>
        </form>
      </mat-card-content>
    </mat-card>
  `
})
export class FeedbackComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly complaintService = inject(ComplaintService);
  private readonly notificationService = inject(NotificationService);
  private readonly complaintId = Number(this.route.snapshot.paramMap.get('id'));

  readonly saving = signal(false);
  readonly form = this.fb.group({
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    comments: ['', Validators.required]
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const { rating, comments } = this.form.getRawValue();
    this.saving.set(true);
    this.complaintService
      .saveFeedback(this.complaintId, Number(rating), comments ?? '')
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => this.notificationService.success('Feedback submitted. Thank you!'),
        error: () => this.notificationService.error('Unable to save feedback right now.')
      });
  }
}
