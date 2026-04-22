import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentService } from '../../core/services/department.service';
import { UserService } from '../../core/services/user.service';
import { DepartmentResponse, UserResponse } from '../../core/models/models';
import { AuthService } from '../../core/services/auth.service';
import { AdminLayoutComponent } from '../../shared/components/admin-layout/admin-layout.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule, AdminLayoutComponent],
  template: `
  <app-admin-layout active="departments">
    <div class="page-wrap">
      <div class="page-header">
        <div class="page-header-left">
          <h2>Departments</h2>
          <p>Manage municipal departments, assign supervisors, and control complaint routing.</p>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-primary btn-sm" (click)="openForm()">+ Add Department</button>
        </div>
      </div>

      <div *ngIf="successMsg" class="alert alert-success">{{ successMsg }}</div>
      <div *ngIf="error"      class="alert alert-danger">{{ error }}</div>

      <div *ngIf="loading" class="loading-row"><div class="spinner"></div></div>

      <div *ngIf="!loading" class="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Department Name</th>
              <th>Description</th>
              <th>Supervisor / Head</th>
              <th style="text-align:right;">Complaints</th>
              <th>Created</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let d of departments; let i = index">
              <td style="color:var(--text-500);font-size:0.75rem;">{{ i + 1 }}</td>
              <td style="font-size:0.85rem;font-weight:600;color:var(--text-900);">{{ d.name }}</td>
              <td style="font-size:0.8rem;color:var(--text-500);max-width:240px;">{{ d.description || '—' }}</td>
              <td>
                <span *ngIf="d.headName" style="font-size:0.8rem;font-weight:600;color:var(--text-700);">{{ d.headName }}</span>
                <span *ngIf="!d.headName" style="font-size:0.75rem;color:var(--text-400);">Unassigned</span>
              </td>
              <td style="text-align:right;font-size:0.82rem;font-weight:600;">{{ d.totalComplaints }}</td>
              <td style="font-size:0.75rem;color:var(--text-500);">{{ d.createdAt | date:'dd/MM/yyyy' }}</td>
              <td style="text-align:right;">
                <button class="btn btn-ghost btn-xs" (click)="openEdit(d)" style="margin-right:4px;">Edit</button>
                <button class="btn btn-danger-ghost btn-xs" (click)="confirmDelete(d)">Delete</button>
              </td>
            </tr>
            <tr *ngIf="departments.length === 0">
              <td colspan="7" class="text-muted" style="text-align:center;padding:32px;font-size:0.82rem;">
                No departments yet. Click "Add Department" to create one.
              </td>
            </tr>
          </tbody>
        </table>
        <div class="table-footer"><span>{{ departments.length }} department(s)</span></div>
      </div>
    </div>
  </app-admin-layout>

  <!-- Add / Edit Department Modal -->
  <div class="modal-overlay" *ngIf="showForm" (click)="closeForm()">
    <div class="modal-box modal-sm" (click)="$event.stopPropagation()">
      <div class="modal-head">
        <h4>{{ editingDept ? 'Edit Department' : 'Add New Department' }}</h4>
        <button class="modal-close-btn" (click)="closeForm()">&#215;</button>
      </div>
      <div class="modal-body">
        <form [formGroup]="deptForm" id="dept-form">
          <div class="form-group">
            <label>Department Name <span class="required">*</span></label>
            <input type="text" formControlName="name" class="form-control" placeholder="e.g., Roads &amp; Infrastructure" />
            <span *ngIf="deptForm.get('name')?.invalid && deptForm.get('name')?.touched" class="field-error">Name is required.</span>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea formControlName="description" class="form-control" rows="2" placeholder="Brief description…"></textarea>
          </div>
          <div class="form-group">
            <label>Supervisor / Department Head</label>
            <select formControlName="supervisorId" class="form-control">
              <option [ngValue]="null">— No supervisor assigned —</option>
              <option *ngFor="let s of supervisors" [ngValue]="s.id">
                {{ s.name }} ({{ s.email }}){{ s.departmentName && s.departmentName !== editingDept?.name ? ' — ' + s.departmentName : '' }}
              </option>
            </select>
            <div style="font-size:0.72rem;color:var(--text-500);margin-top:4px;">
              Only approved Supervisors are listed. Assigning here also updates the officer's department.
            </div>
          </div>
          <div class="form-group">
            <label>Contact Email <span style="font-weight:400;color:var(--text-400);">(optional)</span></label>
            <input type="email" formControlName="contactEmail" class="form-control" placeholder="dept@civic.gov" />
          </div>
        </form>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost btn-sm" (click)="closeForm()" [disabled]="submitting">Cancel</button>
        <button class="btn btn-primary btn-sm" (click)="submitForm()" [disabled]="deptForm.invalid || submitting">
          {{ submitting ? 'Saving…' : (editingDept ? 'Update' : 'Create') }}
        </button>
      </div>
    </div>
  </div>
  `
})
export class DepartmentsComponent implements OnInit {
  departments: DepartmentResponse[] = [];
  supervisors: UserResponse[] = [];
  loading = false;
  error = '';
  successMsg = '';
  showForm = false;
  submitting = false;
  editingDept: DepartmentResponse | null = null;
  deptForm: FormGroup;

  constructor(
    public auth: AuthService,
    private departmentService: DepartmentService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.deptForm = this.fb.group({
      name:        ['', Validators.required],
      description: [''],
      supervisorId:[ null ],
      contactEmail:[''],
    });
  }

  ngOnInit(): void {
    this.loading = true;
    forkJoin({
      depts: this.departmentService.getAll(),
      supervisors: this.userService.getUsersByRole('SUPERVISOR'),
    }).subscribe({
      next: ({ depts, supervisors }) => {
        this.departments = depts;
        this.supervisors = supervisors.filter(s => s.approved);
        this.loading = false;
      },
      error: () => { this.error = 'Failed to load data.'; this.loading = false; }
    });
  }

  openForm(): void {
    this.editingDept = null;
    this.deptForm.reset({ name: '', description: '', supervisorId: null, contactEmail: '' });
    this.showForm = true;
  }

  openEdit(d: DepartmentResponse): void {
    this.editingDept = d;
    this.deptForm.patchValue({
      name:         d.name,
      description:  d.description ?? '',
      supervisorId: d.headId ?? null,
      contactEmail: d.contactEmail ?? '',
    });
    this.showForm = true;
  }

  closeForm(): void { this.showForm = false; this.editingDept = null; }

  submitForm(): void {
    if (this.deptForm.invalid) return;
    this.submitting = true;
    this.error = '';
    const { name, description, supervisorId, contactEmail } = this.deptForm.value;
    const data = { name, description: description || undefined, supervisorId: supervisorId ?? null, contactEmail: contactEmail || undefined };

    const call = this.editingDept
      ? this.departmentService.update(this.editingDept.id, data)
      : this.departmentService.create(data);

    call.subscribe({
      next: (saved) => {
        if (this.editingDept) {
          const idx = this.departments.findIndex(x => x.id === saved.id);
          if (idx !== -1) this.departments[idx] = saved;
          this.successMsg = 'Department updated.';
        } else {
          this.departments.push(saved);
          this.successMsg = 'Department created.';
        }
        this.closeForm();
        this.submitting = false;
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to save department.';
        this.submitting = false;
      }
    });
  }

  confirmDelete(d: DepartmentResponse): void {
    if (!confirm(`Delete department "${d.name}"? This cannot be undone.`)) return;
    this.departmentService.delete(d.id).subscribe({
      next: () => {
        this.departments = this.departments.filter(x => x.id !== d.id);
        this.successMsg = 'Department deleted.';
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err) => { this.error = err?.error?.message || 'Delete failed.'; }
    });
  }
}