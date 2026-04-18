import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { AppShellComponent } from './shared/components/app-shell/app-shell.component';
import { HomeComponent } from './shared/components/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'citizen',
    component: AppShellComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'CITIZEN' },
    children: [
      { path: 'dashboard', loadComponent: () => import('./citizen/citizen-dashboard.component').then((m) => m.CitizenDashboardComponent) },
      { path: 'raise-complaint', loadComponent: () => import('./citizen/raise-complaint.component').then((m) => m.RaiseComplaintComponent) },
      { path: 'my-complaints', loadComponent: () => import('./citizen/my-complaints.component').then((m) => m.MyComplaintsComponent) },
      { path: 'tracking/:id', loadComponent: () => import('./citizen/complaint-tracking.component').then((m) => m.ComplaintTrackingComponent) },
      { path: 'feedback/:id', loadComponent: () => import('./citizen/feedback.component').then((m) => m.FeedbackComponent) },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
    ]
  },
  {
    path: 'officer',
    component: AppShellComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'OFFICER' },
    children: [
      { path: 'tasks', loadComponent: () => import('./officer/assigned-tasks.component').then((m) => m.AssignedTasksComponent) },
      { path: 'tasks/:id', loadComponent: () => import('./officer/task-details.component').then((m) => m.TaskDetailsComponent) },
      { path: 'update-status/:id', loadComponent: () => import('./officer/update-status.component').then((m) => m.UpdateStatusComponent) },
      { path: '', pathMatch: 'full', redirectTo: 'tasks' }
    ]
  },
  {
    path: 'admin',
    component: AppShellComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' },
    children: [
      { path: 'dashboard', loadComponent: () => import('./admin/dashboard.component').then((m) => m.AdminDashboardComponent) },
      { path: 'complaints', loadComponent: () => import('./admin/complaint-list.component').then((m) => m.ComplaintListComponent) },
      { path: 'assign-officer/:id', loadComponent: () => import('./admin/assign-officer.component').then((m) => m.AssignOfficerComponent) },
      { path: 'analytics', loadComponent: () => import('./admin/analytics.component').then((m) => m.AnalyticsComponent) },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
    ]
  },
  { path: '**', redirectTo: '' }
];
