import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Complaint } from '../models/complaint.model';
import { AuthService } from '../services/auth.service';
import { ComplaintService } from '../services/complaint.service';

@Component({
  selector: 'app-my-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatPaginatorModule, MatSelectModule, MatTableModule, DatePipe],
  template: `
    <mat-card class="rounded-[1.75rem] border border-slate-200 !shadow-none">
      <mat-card-content class="p-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p class="font-display text-2xl font-bold text-ink-900">My complaints</p>
            <p class="text-sm text-ink-600">Filter by status and priority, then open tracking for details.</p>
          </div>
          <div class="flex flex-wrap gap-3">
            <mat-form-field appearance="outline">
              <mat-label>Status</mat-label>
              <mat-select [(ngModel)]="statusFilter" (selectionChange)="applyFilters()">
                <mat-option value="">All</mat-option>
                <mat-option value="PENDING">Pending</mat-option>
                <mat-option value="ASSIGNED">Assigned</mat-option>
                <mat-option value="IN_PROGRESS">In progress</mat-option>
                <mat-option value="RESOLVED">Resolved</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Priority</mat-label>
              <mat-select [(ngModel)]="priorityFilter" (selectionChange)="applyFilters()">
                <mat-option value="">All</mat-option>
                <mat-option value="LOW">Low</mat-option>
                <mat-option value="MEDIUM">Medium</mat-option>
                <mat-option value="HIGH">High</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </div>

        <div class="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <table mat-table [dataSource]="dataSource" class="w-full">
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Complaint</th>
              <td mat-cell *matCellDef="let complaint">{{ complaint.title }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let complaint">{{ complaint.status }}</td>
            </ng-container>
            <ng-container matColumnDef="priority">
              <th mat-header-cell *matHeaderCellDef>Priority</th>
              <td mat-cell *matCellDef="let complaint">{{ complaint.priority }}</td>
            </ng-container>
            <ng-container matColumnDef="createdAt">
              <th mat-header-cell *matHeaderCellDef>Created</th>
              <td mat-cell *matCellDef="let complaint">{{ complaint.createdAt | date:'mediumDate' }}</td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let complaint">
                <a [routerLink]="['/citizen/tracking', complaint.id]" class="font-semibold text-civic-700">Track</a>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
        </div>
        <mat-paginator [pageSize]="5"></mat-paginator>
      </mat-card-content>
    </mat-card>
  `
})
export class MyComplaintsComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private readonly authService = inject(AuthService);
  private readonly complaintService = inject(ComplaintService);

  readonly displayedColumns = ['title', 'status', 'priority', 'createdAt', 'actions'];
  readonly dataSource = new MatTableDataSource<Complaint>([]);
  statusFilter = '';
  priorityFilter = '';
  private complaints: Complaint[] = [];

  constructor() {
    this.complaintService.getCitizenComplaints(this.authService.currentUser()?.id ?? 1).subscribe((complaints) => {
      this.complaints = complaints;
      this.dataSource.data = complaints;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilters(): void {
    this.dataSource.data = this.complaints.filter((complaint) => {
      const statusMatch = this.statusFilter ? complaint.status === this.statusFilter : true;
      const priorityMatch = this.priorityFilter ? complaint.priority === this.priorityFilter : true;
      return statusMatch && priorityMatch;
    });
  }
}
