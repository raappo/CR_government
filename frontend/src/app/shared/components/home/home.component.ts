import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule, MatIconModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar />
    <section class="relative overflow-hidden bg-ink-900 text-white">
      <div class="absolute inset-0 bg-civic-grid bg-[size:44px_44px] opacity-10"></div>
      <div class="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top_right,_rgba(43,187,163,0.35),_transparent_40%)]"></div>
      <div class="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
        <div class="relative z-10">
          <span class="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-1 text-sm text-white/80">
            Urban governance made transparent
          </span>
          <h1 class="mt-6 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Smart Civic Grievance Management System
          </h1>
          <p class="mt-6 max-w-2xl text-lg text-white/75">
            Raise complaints. Track progress. Improve your city.
          </p>
          <div class="mt-8 flex flex-wrap gap-4">
            <a mat-flat-button color="primary" routerLink="/register">Register</a>
            <a mat-stroked-button routerLink="/login" class="!border-white/30 !text-white">Login</a>
          </div>
        </div>

        <div class="relative z-10">
          <div class="rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-civic backdrop-blur">
            <div class="grid gap-4 sm:grid-cols-2">
              @for (metric of impactStats; track metric.label) {
                <div class="rounded-3xl bg-white/90 p-5 text-ink-900">
                  <p class="text-sm text-ink-600">{{ metric.label }}</p>
                  <p class="mt-2 font-display text-3xl font-bold">{{ metric.value }}</p>
                  <p class="mt-2 text-sm text-civic-700">{{ metric.note }}</p>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-white py-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.2em] text-civic-700">About the platform</p>
            <h2 class="mt-3 font-display text-3xl font-bold text-ink-900">A citizen-government bridge built for action</h2>
          </div>
          <p class="text-lg leading-8 text-ink-700">
            This system enables residents to submit civic complaints with geo-location, lets departments monitor SLA
            commitments, and gives administrators the visibility needed to improve response quality across the city.
          </p>
        </div>
      </div>
    </section>

    <section class="bg-slate-50 py-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid gap-5 md:grid-cols-3">
          @for (stat of impactStats; track stat.label) {
            <mat-card class="rounded-[1.75rem] border border-slate-200 !shadow-none">
              <mat-card-content class="p-6">
                <p class="text-sm text-ink-500">{{ stat.label }}</p>
                <p class="mt-3 font-display text-4xl font-bold text-ink-900">{{ stat.value }}</p>
                <p class="mt-3 text-sm text-ink-700">{{ stat.note }}</p>
              </mat-card-content>
            </mat-card>
          }
        </div>
      </div>
    </section>

    <section class="bg-white py-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl">
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-civic-700">Features</p>
          <h2 class="mt-3 font-display text-3xl font-bold text-ink-900">Designed around service speed, accountability, and citizen trust</h2>
        </div>
        <div class="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          @for (feature of features; track feature.title) {
            <mat-card class="rounded-[1.75rem] border border-slate-200 bg-slate-50 !shadow-none">
              <mat-card-content class="p-6">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-civic-100 text-civic-700">
                  <mat-icon>{{ feature.icon }}</mat-icon>
                </div>
                <h3 class="mt-5 text-xl font-semibold text-ink-900">{{ feature.title }}</h3>
                <p class="mt-3 text-sm leading-6 text-ink-700">{{ feature.description }}</p>
              </mat-card-content>
            </mat-card>
          }
        </div>
      </div>
    </section>

    <section class="bg-ink-900 py-16 text-white">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl">
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-civic-300">Citizen voices</p>
          <h2 class="mt-3 font-display text-3xl font-bold">Feedback that reflects real civic outcomes</h2>
        </div>
        <div class="mt-10 grid gap-6 lg:grid-cols-3">
          @for (review of reviews; track review.name) {
            <div class="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p class="text-white/75">"{{ review.quote }}"</p>
              <p class="mt-6 font-semibold">{{ review.name }}</p>
              <p class="text-sm text-civic-200">{{ review.area }}</p>
            </div>
          }
        </div>
      </div>
    </section>
    <app-footer />
  `
})
export class HomeComponent {
  readonly impactStats = [
    { label: 'Complaints resolved', value: '48,260+', note: 'Across sanitation, roads, water, and lighting services' },
    { label: 'Departments', value: '24', note: 'Unified into a single operational command system' },
    { label: 'SLA success', value: '92%', note: 'Average citywide compliance over the last quarter' }
  ];

  readonly features = [
    { icon: 'edit_square', title: 'Easy grievance filing', description: 'Simple forms with department tagging and photo attachments for faster triage.' },
    { icon: 'track_changes', title: 'Real-time tracking', description: 'Citizens can monitor complaint progress from submission to final closure.' },
    { icon: 'location_on', title: 'Geo-tagging', description: 'Latitude and longitude improve field crew routing and proof-based resolution.' },
    { icon: 'hub', title: 'Role-based dashboards', description: 'Separate command views for citizens, officers, and administrators.' }
  ];

  readonly reviews = [
    { name: 'Asha Verma', area: 'Ward 8 Resident', quote: 'I filed a garbage complaint in under two minutes and got updates the same evening.' },
    { name: 'Mohammed Irfan', area: 'School Committee Member', quote: 'The streetlight issue was resolved quickly and the officer uploaded proof before closure.' },
    { name: 'Lakshmi Rao', area: 'RW Association Lead', quote: 'The dashboard gives our community better visibility into which departments respond on time.' }
  ];
}
