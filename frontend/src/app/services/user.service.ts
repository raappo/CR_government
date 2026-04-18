import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { API_BASE_URL, APP_STORAGE_KEYS } from '../core/config/api.config';
import { Department } from '../models/department.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);

  getOfficers(): Observable<User[]> {
    return this.http.get<User[]>(`${API_BASE_URL}/users/officers`).pipe(
      catchError(() => {
        const stored = localStorage.getItem(APP_STORAGE_KEYS.users);
        const users = stored ? (JSON.parse(stored) as User[]) : [];
        return of(users.filter((user) => user.role === 'OFFICER' || user.role === 'ADMIN'));
      })
    );
  }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${API_BASE_URL}/departments`).pipe(
      catchError(() =>
        of([
          { id: 1, name: 'Solid Waste', officerCount: 14, activeComplaints: 68, slaSuccessRate: 91 },
          { id: 2, name: 'Roads & Mobility', officerCount: 11, activeComplaints: 52, slaSuccessRate: 88 },
          { id: 3, name: 'Water Supply', officerCount: 9, activeComplaints: 34, slaSuccessRate: 94 },
          { id: 4, name: 'Street Lighting', officerCount: 8, activeComplaints: 27, slaSuccessRate: 90 }
        ])
      )
    );
  }
}
