import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { authGuard, guestGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
    let authService: jasmine.SpyObj<AuthService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(() => {
        authService = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'getRole']);
        router = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            providers: [
                { provide: AuthService, useValue: authService },
                { provide: Router, useValue: router },
            ],
        });
    });

    function runGuard(role: string | null, requiredRole?: string): boolean {
        const route = { data: requiredRole ? { role: requiredRole } : {} } as unknown as ActivatedRouteSnapshot;
        return TestBed.runInInjectionContext(() => authGuard(route, {} as any)) as boolean;
    }

    // TC-12: Role-based navigation — logged-in citizen accessing citizen route
    it('TC-12: allows citizen to access citizen route', () => {
        authService.isLoggedIn.and.returnValue(true);
        authService.getRole.and.returnValue('citizen');
        expect(runGuard('citizen', 'citizen')).toBeTrue();
    });

    it('TC-12b: blocks citizen from admin route, redirects to citizen dashboard', () => {
        authService.isLoggedIn.and.returnValue(true);
        authService.getRole.and.returnValue('citizen');
        runGuard('citizen', 'admin');
        expect(router.navigate).toHaveBeenCalledWith(['/citizen/dashboard']);
    });

    it('blocks unauthenticated access, redirects to login', () => {
        authService.isLoggedIn.and.returnValue(false);
        runGuard(null, 'citizen');
        expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    });

    it('allows officer to access officer routes', () => {
        authService.isLoggedIn.and.returnValue(true);
        authService.getRole.and.returnValue('officer');
        expect(runGuard('officer', 'officer')).toBeTrue();
    });
});

describe('guestGuard', () => {
    let authService: jasmine.SpyObj<AuthService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(() => {
        authService = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'getRole']);
        router = jasmine.createSpyObj('Router', ['navigate']);
        TestBed.configureTestingModule({
            providers: [
                { provide: AuthService, useValue: authService },
                { provide: Router, useValue: router },
            ],
        });
    });

    it('allows access when not logged in', () => {
        authService.isLoggedIn.and.returnValue(false);
        const result = TestBed.runInInjectionContext(() =>
            guestGuard({} as ActivatedRouteSnapshot, {} as any)
        );
        expect(result).toBeTrue();
    });

    it('blocks logged-in citizen from login page, redirects to dashboard', () => {
        authService.isLoggedIn.and.returnValue(true);
        authService.getRole.and.returnValue('citizen');
        TestBed.runInInjectionContext(() =>
            guestGuard({} as ActivatedRouteSnapshot, {} as any)
        );
        expect(router.navigate).toHaveBeenCalledWith(['/citizen/dashboard']);
    });
});