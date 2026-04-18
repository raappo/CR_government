import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { ComplaintService } from '../services/complaint.service';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule, DatePipe],
  template: `
    @if (task$ | async; as task) {
      <div class="space-y-6">
        <mat-card class="rounded-[1.75rem] border border-slate-200 !shadow-none">
          <mat-card-content class="p-6">
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p class="text-sm uppercase tracking-[0.2em] text-civic-700">Field task details</p>
                <h1 class="mt-2 font-display text-3xl font-bold text-ink-900">{{ task.title }}</h1>
                <p class="mt-3 text-ink-700">{{ task.description }}</p>
              </div>
              <a mat-flat-button color="primary" [routerLink]="['/officer/update-status', task.id]">Update status</a>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="rounded-[1.75rem] border border-slate-200 !shadow-none">
          <mat-card-content class="grid gap-5 p-6 md:grid-cols-2">
            <div><p class="text-sm text-ink-500">Citizen</p><p class="font-semibold text-ink-900">{{ task.citizenName }}</p></div>
            <div><p class="text-sm text-ink-500">Priority</p><p class="font-semibold text-ink-900">{{ task.priority }}</p></div>
            <div><p class="text-sm text-ink-500">Status</p><p class="font-semibold text-ink-900">{{ task.status }}</p></div>
            <div><p class="text-sm text-ink-500">Updated</p><p class="font-semibold text-ink-900">{{ task.updatedAt | date:'medium' }}</p></div>
          </mat-card-content>
        </mat-card>
      </div>
    }
  `
})
export class TaskDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly complaintService = inject(ComplaintService);

  readonly task$ = this.route.paramMap.pipe(switchMap((params) => this.complaintService.getComplaintById(Number(params.get('id')))));
}
