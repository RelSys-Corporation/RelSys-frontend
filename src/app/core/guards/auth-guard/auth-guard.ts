import { Inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = Inject(AuthService);
  const router = Inject(Router);

  if (authService.isAuthenticated())
    return true;

  return router.createUrlTree(['/main'], {
    queryParms: {returnUrl: state.url}
  })
};
