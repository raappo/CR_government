import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

interface AuditLogItem {
    id: number;
    action: string;
    details: string;
    actorName: string;
    entityType: string;
    relatedEntityId: number;
    createdAt: string;
}

@Component({
    selector: 'app-audit-logs',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="dashboard-layout">
      <aside class="sidebar">
        <div class="sidebar-user">
          <div class="avatar" style="background:#e9c46a; color:#1a2340;">AD</div>
          <div class="user-name">{{ auth.currentUser()?.name }}</div>
          <div class="user-role">System Administrator</div>
        </div>
        <nav class="nav-menu">
          <div class="nav-section-title">Overview</div>
          <a routerLink="/admin/dashboard" class="nav-item"><span class="nav-icon">📊</span> Dashboard</a>
          <a routerLink="/admin/all-complaints" class="nav-item"><span class="nav-icon">📋</span> All Complaints</a>
          <a routerLink="/admin/citizens" class="nav-item"><span class="nav-icon">👥</span> Citizens</a>
          <a routerLink="/admin/officers" class="nav-item"><span class="nav-icon">👮</span> Officers</a>
          <div class="nav-section-title">Management</div>
          <a routerLink="/admin/departments" class="nav-item"><span class="nav-icon">🏢</span> Departments</a>
          <div class="nav-section-title">Reports</div>
          <a routerLink="/admin/analytics" class="nav-item"><span class="nav-icon">📈</span> Analytics</a>
          <a routerLink="/admin/audit-logs" class="nav-item active"><span class="nav-icon">🔒</span> Audit Logs</a>
          <div class="nav-section-title">Account</div>
          <a routerLink="/profile" class="nav-item"><span class="nav-icon">👤</span> Profile</a>
          <button class="nav-item logout-btn" (click)="auth.logout()"><span class="nav-icon">🚪</span> Sign Out</button>
        </nav>
      </aside>

      <main class="main-content">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px;">
          <div>
            <h2>Audit Logs</h2>
            <p style="font-size:0.875rem; color:var(--text-muted); margin:0;">
              System activity trail — last 100 events.
            </p>
          </div>
          <button class="btn btn-outline btn-sm" (click)="load()">🔄 Refresh</button>
        </div>

        <div *ngIf="loading" style="text-align:center; padding:40px;"><div class="spinner"></div></div>
        <div *ngIf="error" class="alert alert-danger">{{ error }}</div>

        <div *ngIf="!loading && logs.length === 0" class="empty-card">
          <h3>No Audit Logs Yet</h3>
          <p>System events will appear here as actions are taken.</p>
        </div>

        <div *ngIf="!loading && logs.length > 0" class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Action</th><th>Details</th>
                <th>Actor</th><th>Entity</th><th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let log of logs">
                <td style="font-size:0.75rem; color:var(--text-muted);">#{{ log.id }}</td>
                <td>
                  <span class="action-badge" [class]="getActionClass(log.action)">
                    {{ log.action.split('_').join(' ') }}
                  </span>
                </td>
                <td style="font-size:0.82rem; max-width:280px;">{{ log.details }}</td>
                <td style="font-size:0.82rem;">{{ log.actorName || '—' }}</td>
                <td>
                  <span style="font-size:0.72rem; background:var(--bg-muted); padding:2px 8px; border-radius:20px; font-weight:600;">
                    {{ log.entityType }} {{ log.relatedEntityId ? '#' + log.relatedEntityId : '' }}
                  </span>
                </td>
                <td style="font-size:0.75rem; color:var(--text-muted); white-space:nowrap;">
                  {{ log.createdAt | date:'dd MMM yy, h:mm a' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  `,
    styles: [`
    .empty-card { text-align:center; padding:48px; background:white; border-radius:var(--radius-md);
      border:1px solid var(--border); h3 { margin-bottom:8px; } p { color:var(--text-muted); } }
    .table-wrapper { background:white; border:1px solid var(--border); border-radius:var(--radius-md); overflow:hidden; }
    .action-badge { font-size:0.7rem; font-weight:700; padding:3px 8px; border-radius:4px; white-space:nowrap;
      &.act-create { background:#d1fae5; color:#065f46; }
      &.act-change  { background:#dbeafe; color:#1e40af; }
      &.act-assign  { background:#fef3c7; color:#92400e; }
      &.act-delete  { background:#fee2e2; color:#991b1b; }
      &.act-default { background:var(--bg-muted); color:var(--text-secondary); } }
    .logout-btn { background:none; border:none; width:100%; text-align:left; color:rgba(255,255,255,0.75); cursor:pointer; font-family:var(--font); font-size:0.875rem; }
  `]
})
export class AuditLogsComponent implements OnInit {
    logs: AuditLogItem[] = [];
    loading = false;
    error = '';

    constructor(public auth: AuthService, private http: HttpClient) { }

    ngOnInit(): void { this.load(); }

    load(): void {
        this.loading = true;
        this.error = '';
        this.http.get<AuditLogItem[]>(`${environment.apiUrl}/admin/audit-logs`).subscribe({
            next: (list) => { this.logs = list; this.loading = false; },
            error: () => { this.error = 'Failed to load audit logs.'; this.loading = false; }
        });
    }

    getActionClass(action: string): string {
        if (action.includes('CREATED')) return 'act-create';
        if (action.includes('CHANGED') || action.includes('UPDATED')) return 'act-change';
        if (action.includes('ASSIGNED')) return 'act-assign';
        if (action.includes('DELETED')) return 'act-delete';
        return 'act-default';
    }
}