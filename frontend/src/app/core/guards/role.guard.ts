import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRole = route.data['role'] as string | undefined;
  const currentRole = authService.currentUser()?.role;

  if (!expectedRole || expectedRole === currentRole) {
    return true;
  }

  return router.createUrlTree(['/']);
};
