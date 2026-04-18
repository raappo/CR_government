import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { ComplaintService } from '../services/complaint.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-update-status',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  template: `
    <mat-card class="rounded-[1.75rem] border border-slate-200 !shadow-none">
      <mat-card-content class="p-6">
        <p class="text-sm uppercase tracking-[0.2em] text-civic-700">Officer action</p>
        <h1 class="mt-2 font-display text-3xl font-bold text-ink-900">Update complaint status</h1>
        <form class="mt-8 space-y-5" [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              <mat-option value="ASSIGNED">Assigned</mat-option>
              <mat-option value="IN_PROGRESS">In progress</mat-option>
              <mat-option value="RESOLVED">Resolved</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Proof image URL</mat-label>
            <input matInput formControlName="proofImageUrl" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Note</mat-label>
            <textarea matInput rows="5" formControlName="note"></textarea>
          </mat-form-field>
          <button mat-flat-button color="primary" class="!rounded-xl !px-6 !py-6" [disabled]="form.invalid || saving()">Save update</button>
        </form>
      </mat-card-content>
    </mat-card>
  `
})
export class UpdateStatusComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly complaintService = inject(ComplaintService);
  private readonly notificationService = inject(NotificationService);
  private readonly complaintId = Number(this.route.snapshot.paramMap.get('id'));

  readonly saving = signal(false);
  readonly form = this.fb.group({
    status: ['IN_PROGRESS', Validators.required],
    proofImageUrl: [''],
    note: ['', Validators.required]
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const { status, note, proofImageUrl } = this.form.getRawValue();
    this.saving.set(true);
    this.complaintService
      .updateComplaintStatus(this.complaintId, status as never, note ?? '', proofImageUrl ?? '')
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => this.notificationService.success('Task status updated successfully'),
        error: () => this.notificationService.error('Unable to update the task right now.')
      });
  }
}
