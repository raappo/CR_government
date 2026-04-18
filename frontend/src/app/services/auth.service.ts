import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, delay, map, Observable, of, tap } from 'rxjs';
import { API_BASE_URL, APP_STORAGE_KEYS } from '../core/config/api.config';
import { User, UserRole } from '../models/user.model';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  contactNumber: string;
  address: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly currentUserSignal = signal<User | null>(this.readStoredUser());

  readonly currentUser = computed(() => this.currentUserSignal());
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());

  login(payload: LoginPayload): Observable<User> {
    return this.http.post<User>(`${API_BASE_URL}/auth/login`, payload).pipe(
      tap((user) => this.persistUser(user)),
      catchError(() => this.mockLogin(payload))
    );
  }

  register(payload: RegisterPayload): Observable<User> {
    return this.http.post<User>(`${API_BASE_URL}/auth/register`, payload).pipe(
      tap((user) => this.persistUser(user)),
      catchError(() => this.mockRegister(payload))
    );
  }

  logout(): void {
    localStorage.removeItem(APP_STORAGE_KEYS.user);
    this.currentUserSignal.set(null);
    void this.router.navigate(['/']);
  }

  redirectForRole(role: UserRole): Promise<boolean> {
    const destination =
      role === 'ADMIN'
        ? '/admin/dashboard'
        : role === 'OFFICER'
          ? '/officer/tasks'
          : '/citizen/dashboard';

    return this.router.navigate([destination]);
  }

  private mockLogin(payload: LoginPayload): Observable<User> {
    const users = this.readUsers();
    const found = users.find((user) => user.email === payload.email);
    const fallbackUser =
      found ??
      ({
        id: users.length + 1,
        name: payload.email.split('@')[0],
        email: payload.email,
        role: payload.email.includes('admin')
          ? 'ADMIN'
          : payload.email.includes('officer')
            ? 'OFFICER'
            : 'CITIZEN',
        contactNumber: '9000000000',
        address: 'Civic Ward Office',
        token: 'demo-token'
      } satisfies User);

    return of(fallbackUser).pipe(
      delay(400),
      tap((user) => this.persistUser(user))
    );
  }

  private mockRegister(payload: RegisterPayload): Observable<User> {
    const users = this.readUsers();
    const newUser: User = {
      id: users.length + 1,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      contactNumber: payload.contactNumber,
      address: payload.address,
      token: 'demo-token'
    };

    localStorage.setItem(APP_STORAGE_KEYS.users, JSON.stringify([...users, newUser]));

    return of(newUser).pipe(
      delay(400),
      tap((user) => this.persistUser(user))
    );
  }

  private persistUser(user: User): void {
    const normalized = { ...user, token: user.token ?? 'demo-token' };
    localStorage.setItem(APP_STORAGE_KEYS.user, JSON.stringify(normalized));
    this.currentUserSignal.set(normalized);
  }

  private readStoredUser(): User | null {
    const stored = localStorage.getItem(APP_STORAGE_KEYS.user);
    return stored ? (JSON.parse(stored) as User) : null;
  }

  private readUsers(): User[] {
    const stored = localStorage.getItem(APP_STORAGE_KEYS.users);
    return stored ? (JSON.parse(stored) as User[]) : this.seedUsers();
  }

  private seedUsers(): User[] {
    const seeded: User[] = [
      {
        id: 1,
        name: 'Asha Verma',
        email: 'citizen@civic.local',
        role: 'CITIZEN',
        contactNumber: '9876543210',
        address: 'Ward 8, Bengaluru',
        token: 'demo-token'
      },
      {
        id: 2,
        name: 'Ravi Kumar',
        email: 'officer@civic.local',
        role: 'OFFICER',
        contactNumber: '9988776655',
        address: 'Zone 2 Municipal Office',
        department: 'Solid Waste',
        token: 'demo-token'
      },
      {
        id: 3,
        name: 'Priya Menon',
        email: 'admin@civic.local',
        role: 'ADMIN',
        contactNumber: '9001112233',
        address: 'City Command Centre',
        token: 'demo-token'
      }
    ];

    localStorage.setItem(APP_STORAGE_KEYS.users, JSON.stringify(seeded));
    return seeded;
  }
}
