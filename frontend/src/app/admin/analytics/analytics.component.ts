import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ComplaintService } from '../../core/services/complaint.service';
import { AuthService } from '../../core/services/auth.service';
import { ComplaintStatsResponse } from '../../core/models/models';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-analytics',
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
          <a routerLink="/admin/analytics" class="nav-item active"><span class="nav-icon">📈</span> Analytics</a>
          <a routerLink="/admin/audit-logs" class="nav-item"><span class="nav-icon">🔒</span> Audit Logs</a>
          <div class="nav-section-title">Account</div>
          <a routerLink="/profile" class="nav-item"><span class="nav-icon">👤</span> Profile</a>
          <button class="nav-item logout-btn" (click)="auth.logout()"><span class="nav-icon">🚪</span> Sign Out</button>
        </nav>
      </aside>

      <main class="main-content">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px;">
          <div>
            <h2>Analytics & Reports</h2>
            <p style="font-size:0.875rem; color:var(--text-muted); margin:0;">
              Live complaint resolution KPIs and performance metrics.
            </p>
          </div>
          <div style="display:flex; gap:10px;">
            <button class="btn btn-outline btn-sm" (click)="exportCsv()" [disabled]="exporting">
              {{ exporting ? 'Preparing...' : '📥 Export CSV' }}
            </button>
            <button class="btn btn-primary btn-sm" (click)="refresh()">🔄 Refresh</button>
          </div>
        </div>

        <div *ngIf="loading" style="text-align:center; padding:40px;"><div class="spinner"></div></div>
        <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
        <div *ngIf="exportMsg" class="alert alert-success">{{ exportMsg }}</div>

        <div *ngIf="!loading && stats" class="analytics-content">
          <!-- Top KPIs -->
          <div class="kpi-row">
            <div class="kpi-box primary">
              <div class="kpi-label">Total Complaints</div>
              <div class="kpi-val">{{ stats.total }}</div>
            </div>
            <div class="kpi-box green">
              <div class="kpi-label">Resolved + Closed</div>
              <div class="kpi-val">{{ stats.resolved + stats.closed }}</div>
              <div class="kpi-rate">{{ resolutionRate }}% rate</div>
            </div>
            <div class="kpi-box orange">
              <div class="kpi-label">Pending</div>
              <div class="kpi-val">{{ stats.pending }}</div>
            </div>
            <div class="kpi-box blue">
              <div class="kpi-label">In Progress</div>
              <div class="kpi-val">{{ stats.inProgress }}</div>
            </div>
            <div class="kpi-box red">
              <div class="kpi-label">High / Urgent</div>
              <div class="kpi-val">{{ stats.highPriority + stats.urgentPriority }}</div>
            </div>
          </div>

          <!-- Status Distribution -->
          <div class="charts-grid">
            <div class="chart-card">
              <h3>Status Distribution</h3>
              <div class="bar-chart">
                <div *ngFor="let s of statusBars" class="bar-row">
                  <div class="bar-label">{{ s.label }}</div>
                  <div class="bar-track">
                    <div class="bar-fill" [style.width.%]="s.pct" [style.background]="s.color"></div>
                  </div>
                  <div class="bar-count">{{ s.count }}</div>
                  <div class="bar-pct">{{ s.pct }}%</div>
                </div>
              </div>
            </div>

            <div class="chart-card">
              <h3>Priority Breakdown</h3>
              <div class="bar-chart">
                <div *ngFor="let p of priorityBars" class="bar-row">
                  <div class="bar-label">{{ p.label }}</div>
                  <div class="bar-track">
                    <div class="bar-fill" [style.width.%]="p.pct" [style.background]="p.color"></div>
                  </div>
                  <div class="bar-count">{{ p.count }}</div>
                  <div class="bar-pct">{{ p.pct }}%</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Summary Table -->
          <div class="summary-section">
            <h3>Platform Summary</h3>
            <div class="summary-table">
              <div class="st-row" *ngFor="let row of summaryRows">
                <div class="st-label">{{ row.label }}</div>
                <div class="st-value" [style.color]="row.color || 'var(--text-primary)'">{{ row.value }}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
    styles: [`
    .analytics-content { display:flex; flex-direction:column; gap:24px; }
    .kpi-row { display:grid; grid-template-columns:repeat(5,1fr); gap:14px;
      @media (max-width:1024px) { grid-template-columns:repeat(3,1fr); }
      @media (max-width:600px)  { grid-template-columns:repeat(2,1fr); } }
    .kpi-box { background:white; border:1px solid var(--border); border-radius:var(--radius-md);
      padding:20px; border-top:3px solid transparent;
      &.primary { border-top-color:var(--primary); }
      &.green   { border-top-color:var(--secondary); }
      &.orange  { border-top-color:#ea580c; }
      &.blue    { border-top-color:#0891b2; }
      &.red     { border-top-color:var(--danger); }
      .kpi-label { font-size:0.72rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px; }
      .kpi-val   { font-size:2rem; font-weight:800; color:var(--text-primary); line-height:1; }
      .kpi-rate  { font-size:0.75rem; color:var(--secondary); font-weight:600; margin-top:4px; } }
    .charts-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px;
      @media (max-width:900px) { grid-template-columns:1fr; } }
    .chart-card { background:white; border:1px solid var(--border); border-radius:var(--radius-md); padding:24px;
      h3 { font-size:1rem; margin-bottom:20px; color:var(--text-primary); } }
    .bar-chart { display:flex; flex-direction:column; gap:12px; }
    .bar-row { display:grid; grid-template-columns:100px 1fr 50px 48px; align-items:center; gap:10px;
      .bar-label { font-size:0.8rem; color:var(--text-secondary); font-weight:500; }
      .bar-track { height:10px; background:var(--border); border-radius:6px; overflow:hidden;
        .bar-fill { height:100%; border-radius:6px; transition:width 0.5s ease; } }
      .bar-count { font-size:0.8rem; font-weight:700; color:var(--text-primary); text-align:right; }
      .bar-pct   { font-size:0.72rem; color:var(--text-muted); text-align:right; } }
    .summary-section { background:white; border:1px solid var(--border); border-radius:var(--radius-md); padding:24px;
      h3 { font-size:1rem; margin-bottom:20px; } }
    .summary-table { display:grid; grid-template-columns:repeat(2,1fr); gap:0;
      @media (max-width:600px) { grid-template-columns:1fr; } }
    .st-row { display:flex; justify-content:space-between; padding:12px 16px; border-bottom:1px solid var(--border);
      &:nth-child(even) { background:var(--bg-muted); }
      .st-label { font-size:0.82rem; color:var(--text-muted); }
      .st-value { font-size:0.875rem; font-weight:700; } }
    .logout-btn { background:none; border:none; width:100%; text-align:left; color:rgba(255,255,255,0.75); cursor:pointer; font-family:var(--font); font-size:0.875rem; }
  `]
})
export class AnalyticsComponent implements OnInit {
    stats: ComplaintStatsResponse | null = null;
    loading = false;
    error = '';
    exporting = false;
    exportMsg = '';

    constructor(
        public auth: AuthService,
        private complaintService: ComplaintService
    ) { }

    ngOnInit(): void { this.loadStats(); }

    loadStats(): void {
        this.loading = true;
        this.error = '';
        this.complaintService.getStats().subscribe({
            next: (s) => { this.stats = s; this.loading = false; },
            error: () => { this.error = 'Failed to load analytics.'; this.loading = false; }
        });
    }

    refresh(): void { this.loadStats(); }

    exportCsv(): void {
        this.exporting = true;
        const url = `${environment.apiUrl}/admin/reports/export-csv`;
        const token = localStorage.getItem('civic_jwt_token');
        fetch(url, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.blob())
            .then(blob => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `complaints_${new Date().toISOString().split('T')[0]}.csv`;
                link.click();
                this.exporting = false;
                this.exportMsg = 'CSV downloaded successfully!';
                setTimeout(() => this.exportMsg = '', 3000);
            })
            .catch(() => { this.exporting = false; this.error = 'Export failed.'; });
    }

    get resolutionRate(): number {
        if (!this.stats || this.stats.total === 0) return 0;
        return Math.round(((this.stats.resolved + this.stats.closed) / this.stats.total) * 100);
    }

    get statusBars() {
        if (!this.stats) return [];
        const total = this.stats.total || 1;
        return [
            { label: 'Pending', count: this.stats.pending, pct: pct(this.stats.pending, total), color: '#f59e0b' },
            { label: 'Assigned', count: this.stats.assigned, pct: pct(this.stats.assigned, total), color: '#3b82f6' },
            { label: 'In Progress', count: this.stats.inProgress, pct: pct(this.stats.inProgress, total), color: '#8b5cf6' },
            { label: 'Resolved', count: this.stats.resolved, pct: pct(this.stats.resolved, total), color: '#10b981' },
            { label: 'Closed', count: this.stats.closed, pct: pct(this.stats.closed, total), color: '#6b7280' },
        ];
    }

    get priorityBars() {
        if (!this.stats) return [];
        const high = this.stats.highPriority;
        const urgent = this.stats.urgentPriority;
        const total = this.stats.total || 1;
        const medium = total - high - urgent; // approximate
        return [
            { label: 'Urgent', count: urgent, pct: pct(urgent, total), color: '#7c3aed' },
            { label: 'High', count: high, pct: pct(high, total), color: '#ef4444' },
            { label: 'Medium', count: medium, pct: pct(medium, total), color: '#f59e0b' },
        ];
    }

    get summaryRows() {
        if (!this.stats) return [];
        return [
            { label: 'Total Complaints', value: this.stats.total },
            { label: 'Resolved', value: this.stats.resolved, color: 'var(--secondary)' },
            { label: 'Pending', value: this.stats.pending, color: '#f59e0b' },
            { label: 'Assigned', value: this.stats.assigned, color: '#3b82f6' },
            { label: 'In Progress', value: this.stats.inProgress, color: '#8b5cf6' },
            { label: 'Closed', value: this.stats.closed },
            { label: 'High Priority', value: this.stats.highPriority, color: 'var(--danger)' },
            { label: 'Urgent Priority', value: this.stats.urgentPriority, color: '#7c3aed' },
            { label: 'Registered Citizens', value: this.stats.totalCitizens },
            { label: 'Active Officers', value: this.stats.totalOfficers },
            { label: 'Resolution Rate', value: `${this.resolutionRate}%`, color: 'var(--secondary)' },
        ];
    }
}

function pct(val: number, total: number): number {
    return total === 0 ? 0 : Math.round((val / total) * 100);
}