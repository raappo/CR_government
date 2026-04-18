import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { finalize, take } from 'rxjs';
import { ComplaintService } from '../services/complaint.service';
import { NotificationService } from '../services/notification.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-assign-officer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatSelectModule],
  template: `
    <mat-card class="rounded-[1.75rem] border border-slate-200 !shadow-none">
      <mat-card-content class="p-6">
        <p class="text-sm uppercase tracking-[0.2em] text-civic-700">Assignment desk</p>
        <h1 class="mt-2 font-display text-3xl font-bold text-ink-900">Assign field officer</h1>
        <form class="mt-8 space-y-5" [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Officer</mat-label>
            <mat-select formControlName="officerId">
              @for (officer of officers$ | async; track officer.id) {
                <mat-option [value]="officer.id">{{ officer.name }} · {{ officer.department || officer.role }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <button mat-flat-button color="primary" class="!rounded-xl !px-6 !py-6" [disabled]="form.invalid || saving()">Assign officer</button>
        </form>
      </mat-card-content>
    </mat-card>
  `
})
export class AssignOfficerComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly complaintService = inject(ComplaintService);
  private readonly notificationService = inject(NotificationService);
  private readonly complaintId = Number(this.route.snapshot.paramMap.get('id'));

  readonly saving = signal(false);
  readonly officers$ = this.userService.getOfficers();
  readonly form = this.fb.group({
    officerId: [null as number | null, Validators.required]
  });

  submit(): void {
    const officerId = this.form.getRawValue().officerId;
    if (!officerId) {
      return;
    }

    this.saving.set(true);
    this.officers$.pipe(take(1)).subscribe((officers) => {
      const officer = officers.find((item) => item.id === officerId);
      if (!officer) {
        this.notificationService.error('Officer not found');
        this.saving.set(false);
        return;
      }

      this.complaintService
        .assignOfficer(this.complaintId, officer)
        .pipe(finalize(() => this.saving.set(false)))
        .subscribe({
          next: () => this.notificationService.success('Officer assigned successfully'),
          error: () => this.notificationService.error('Unable to assign the officer right now.')
        });
    });
  }
}
