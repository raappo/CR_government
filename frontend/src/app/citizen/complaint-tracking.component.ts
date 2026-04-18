import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { ComplaintService } from '../services/complaint.service';

@Component({
  selector: 'app-complaint-tracking',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule, DatePipe],
  template: `
    @if (complaint$ | async; as complaint) {
      <div class="space-y-6">
        <mat-card class="rounded-[1.75rem] border border-slate-200 !shadow-none">
          <mat-card-content class="p-6">
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p class="text-sm uppercase tracking-[0.2em] text-civic-700">Complaint tracking</p>
                <h1 class="mt-2 font-display text-3xl font-bold text-ink-900">{{ complaint.title }}</h1>
                <p class="mt-3 max-w-3xl text-ink-700">{{ complaint.description }}</p>
              </div>
              <a mat-flat-button color="primary" [routerLink]="['/citizen/feedback', complaint.id]">Give feedback</a>
            </div>
          </mat-card-content>
        </mat-card>

        <div class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <mat-card class="rounded-[1.75rem] border border-slate-200 !shadow-none">
            <mat-card-content class="p-6">
              <p class="font-display text-xl font-semibold text-ink-900">Timeline</p>
              <div class="mt-6 space-y-5">
                @for (step of complaint.timeline; track step.timestamp) {
                  <div class="flex gap-4">
                    <div class="mt-1 h-4 w-4 rounded-full bg-civic-500"></div>
                    <div>
                      <p class="font-semibold text-ink-900">{{ step.label }}</p>
                      <p class="text-sm text-ink-500">{{ step.timestamp | date:'medium' }}</p>
                      <p class="mt-1 text-sm text-ink-700">{{ step.note }}</p>
                    </div>
                  </div>
                }
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="rounded-[1.75rem] border border-slate-200 !shadow-none">
            <mat-card-content class="grid gap-5 p-6 sm:grid-cols-2">
              <div><p class="text-sm text-ink-500">Status</p><p class="font-semibold text-ink-900">{{ complaint.status }}</p></div>
              <div><p class="text-sm text-ink-500">Priority</p><p class="font-semibold text-ink-900">{{ complaint.priority }}</p></div>
              <div><p class="text-sm text-ink-500">Created</p><p class="font-semibold text-ink-900">{{ complaint.createdAt | date:'medium' }}</p></div>
              <div><p class="text-sm text-ink-500">SLA deadline</p><p class="font-semibold text-ink-900">{{ complaint.slaDeadline | date:'medium' }}</p></div>
              <div class="sm:col-span-2"><p class="text-sm text-ink-500">Assigned officer</p><p class="font-semibold text-ink-900">{{ complaint.assignedOfficerName || 'Awaiting assignment' }}</p></div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    }
  `
})
export class ComplaintTrackingComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly complaintService = inject(ComplaintService);

  readonly complaint$ = this.route.paramMap.pipe(
    switchMap((params) => this.complaintService.getComplaintById(Number(params.get('id'))))
  );
}
