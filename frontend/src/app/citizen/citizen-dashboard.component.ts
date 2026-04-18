import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ComplaintService } from '../services/complaint.service';

@Component({
  selector: 'app-citizen-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterLink, DatePipe],
  template: `
    <div class="space-y-6">
      <section class="rounded-[2rem] bg-[linear-gradient(135deg,#0f1d31,#0f8f79)] p-8 text-white shadow-civic">
        <p class="text-sm uppercase tracking-[0.2em] text-civic-100">Citizen dashboard</p>
        <h1 class="mt-3 font-display text-3xl font-bold">Good to see you, {{ authService.currentUser()?.name }}</h1>
        <p class="mt-3 max-w-2xl text-white/75">Track live status updates, file new issues with geo-location, and rate resolved grievances.</p>
        <div class="mt-6 flex flex-wrap gap-3">
          <a mat-flat-button color="primary" routerLink="/citizen/raise-complaint">Raise complaint</a>
          <a mat-stroked-button routerLink="/citizen/my-complaints" class="!border-white/30 !text-white">View complaints</a>
        </div>
      </section>

      <section class="grid gap-5 md:grid-cols-3">
        @for (card of statCards$ | async; track card.label) {
          <mat-card class="rounded-[1.75rem] border border-slate-200 !shadow-none">
            <mat-card-content class="p-6">
              <p class="text-sm text-ink-500">{{ card.label }}</p>
              <p class="mt-2 font-display text-4xl font-bold text-ink-900">{{ card.value }}</p>
            </mat-card-content>
          </mat-card>
        }
      </section>

      <section class="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <mat-card class="rounded-[1.75rem] border border-slate-200 !shadow-none">
          <mat-card-content class="p-6">
            <p class="font-display text-xl font-semibold text-ink-900">Recent complaints</p>
            <div class="mt-5 space-y-4">
              @for (complaint of complaints$ | async; track complaint.id) {
                <div class="rounded-2xl bg-slate-50 p-4">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <p class="font-semibold text-ink-900">{{ complaint.title }}</p>
                      <p class="text-sm text-ink-600">{{ complaint.createdAt | date:'medium' }}</p>
                    </div>
                    <span class="rounded-full bg-civic-100 px-3 py-1 text-xs font-semibold text-civic-700">{{ complaint.status }}</span>
                  </div>
                </div>
              }
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="rounded-[1.75rem] border border-slate-200 !shadow-none">
          <mat-card-content class="p-6">
            <p class="font-display text-xl font-semibold text-ink-900">Service promise</p>
            <p class="mt-3 text-sm leading-7 text-ink-700">
              Complaints are monitored against SLA deadlines, and every stage from assignment to closure is recorded in a timeline.
            </p>
          </mat-card-content>
        </mat-card>
      </section>
    </div>
  `
})
export class CitizenDashboardComponent {
  readonly authService = inject(AuthService);
  private readonly complaintService = inject(ComplaintService);
  private readonly citizenId = this.authService.currentUser()?.id ?? 1;

  readonly complaints$ = this.complaintService.getCitizenComplaints(this.citizenId);
  readonly statCards$ = this.complaints$.pipe(
    map((complaints) => [
      { label: 'Total raised', value: complaints.length },
      { label: 'In progress', value: complaints.filter((item) => item.status === 'IN_PROGRESS').length },
      { label: 'Resolved', value: complaints.filter((item) => item.status === 'RESOLVED').length }
    ])
  );
}
