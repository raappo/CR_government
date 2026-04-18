import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ComplaintService } from '../services/complaint.service';

@Component({
  selector: 'app-assigned-tasks',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatTableModule, DatePipe],
  template: `
    <mat-card class="rounded-[1.75rem] border border-slate-200 !shadow-none">
      <mat-card-content class="p-6">
        <p class="font-display text-3xl font-bold text-ink-900">Assigned tasks</p>
        <p class="mt-2 text-sm text-ink-600">Operational queue for {{ authService.currentUser()?.name }}</p>

        <div class="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <table mat-table [dataSource]="(tasks$ | async) ?? []" class="w-full">
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Complaint</th>
              <td mat-cell *matCellDef="let task">{{ task.title }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let task">{{ task.status }}</td>
            </ng-container>
            <ng-container matColumnDef="deadline">
              <th mat-header-cell *matHeaderCellDef>SLA</th>
              <td mat-cell *matCellDef="let task">{{ task.slaDeadline | date:'mediumDate' }}</td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Action</th>
              <td mat-cell *matCellDef="let task">
                <a [routerLink]="['/officer/tasks', task.id]" class="font-semibold text-civic-700">Open</a>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
        </div>
      </mat-card-content>
    </mat-card>
  `
})
export class AssignedTasksComponent {
  readonly authService = inject(AuthService);
  private readonly complaintService = inject(ComplaintService);
  readonly displayedColumns = ['title', 'status', 'deadline', 'actions'];
  readonly tasks$ = this.complaintService.getAssignedComplaints(this.authService.currentUser()?.name ?? '');
}
