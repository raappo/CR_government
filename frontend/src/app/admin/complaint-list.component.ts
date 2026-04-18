import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Complaint } from '../models/complaint.model';
import { ComplaintService } from '../services/complaint.service';

@Component({
  selector: 'app-complaint-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatSelectModule, MatTableModule, DatePipe],
  template: `
    <mat-card class="rounded-[1.75rem] border border-slate-200 !shadow-none">
      <mat-card-content class="p-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p class="font-display text-3xl font-bold text-ink-900">Complaint registry</p>
            <p class="text-sm text-ink-600">Filter and assign complaints across departments.</p>
          </div>
          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select [(ngModel)]="statusFilter" (selectionChange)="applyFilter()">
              <mat-option value="">All</mat-option>
              <mat-option value="PENDING">Pending</mat-option>
              <mat-option value="ASSIGNED">Assigned</mat-option>
              <mat-option value="IN_PROGRESS">In progress</mat-option>
              <mat-option value="RESOLVED">Resolved</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <div class="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <table mat-table [dataSource]="filteredComplaints" class="w-full">
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Complaint</th>
              <td mat-cell *matCellDef="let complaint">{{ complaint.title }}</td>
            </ng-container>
            <ng-container matColumnDef="department">
              <th mat-header-cell *matHeaderCellDef>Department</th>
              <td mat-cell *matCellDef="let complaint">{{ complaint.department }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let complaint">{{ complaint.status }}</td>
            </ng-container>
            <ng-container matColumnDef="action">
              <th mat-header-cell *matHeaderCellDef>Action</th>
              <td mat-cell *matCellDef="let complaint">
                <a [routerLink]="['/admin/assign-officer', complaint.id]" class="font-semibold text-civic-700">Assign officer</a>
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
export class ComplaintListComponent {
  private readonly complaintService = inject(ComplaintService);
  readonly displayedColumns = ['title', 'department', 'status', 'action'];
  statusFilter = '';
  complaints: Complaint[] = [];
  filteredComplaints: Complaint[] = [];

  constructor() {
    this.complaintService.getAllComplaints().subscribe((complaints) => {
      this.complaints = complaints;
      this.filteredComplaints = complaints;
    });
  }

  applyFilter(): void {
    this.filteredComplaints = this.statusFilter
      ? this.complaints.filter((complaint) => complaint.status === this.statusFilter)
      : this.complaints;
  }
}
