import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { map } from 'rxjs';
import { ComplaintService } from '../services/complaint.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="space-y-6">
      <section class="rounded-[2rem] bg-[linear-gradient(135deg,#11233a,#244f7a,#0f8f79)] p-8 text-white shadow-civic">
        <p class="text-sm uppercase tracking-[0.2em] text-civic-100">Administrative command center</p>
        <h1 class="mt-3 font-display text-3xl font-bold">Citywide grievance operations at a glance</h1>
      </section>
      <section class="grid gap-5 md:grid-cols-4">
        @for (card of cards$ | async; track card.label) {
          <mat-card class="rounded-[1.75rem] border border-slate-200 !shadow-none">
            <mat-card-content class="p-6">
              <p class="text-sm text-ink-500">{{ card.label }}</p>
              <p class="mt-2 font-display text-4xl font-bold text-ink-900">{{ card.value }}</p>
            </mat-card-content>
          </mat-card>
        }
      </section>
    </div>
  `
})
export class AdminDashboardComponent {
  private readonly complaintService = inject(ComplaintService);
  private readonly userService = inject(UserService);

  readonly cards$ = this.complaintService.getAllComplaints().pipe(
    map((complaints) => [
      { label: 'All complaints', value: complaints.length },
      { label: 'Pending', value: complaints.filter((item) => item.status === 'PENDING').length },
      { label: 'In progress', value: complaints.filter((item) => item.status === 'IN_PROGRESS').length },
      { label: 'Resolved', value: complaints.filter((item) => item.status === 'RESOLVED').length }
    ])
  );
}
