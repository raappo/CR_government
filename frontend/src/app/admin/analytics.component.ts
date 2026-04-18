import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, MatCardModule, NgChartsModule],
  template: `
    <div class="grid gap-6 xl:grid-cols-2">
      <mat-card class="rounded-[1.75rem] border border-slate-200 !shadow-none">
        <mat-card-content class="p-6">
          <p class="font-display text-2xl font-bold text-ink-900">Complaint status mix</p>
          <canvas baseChart [data]="doughnutChartData" [type]="doughnutChartType"></canvas>
        </mat-card-content>
      </mat-card>

      <mat-card class="rounded-[1.75rem] border border-slate-200 !shadow-none">
        <mat-card-content class="p-6">
          <p class="font-display text-2xl font-bold text-ink-900">Resolution performance</p>
          <canvas baseChart [data]="barChartData" [type]="barChartType"></canvas>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class AnalyticsComponent {
  readonly doughnutChartType: ChartType = 'doughnut';
  readonly barChartType: ChartType = 'bar';

  readonly doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Pending', 'Assigned', 'In Progress', 'Resolved'],
    datasets: [{ data: [12, 18, 9, 32], backgroundColor: ['#f59e0b', '#3b82f6', '#14b8a6', '#16a34a'] }]
  };

  readonly barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Solid Waste', 'Roads', 'Water', 'Lighting'],
    datasets: [{ label: 'SLA success %', data: [91, 88, 94, 90], backgroundColor: '#1d8476' }]
  };
}
