import { Routes } from '@angular/router';
import { AuthLayout } from '../../layout/auth-layout/auth-layout';

export const authRoutes: Routes = [
  {
    path: 'login',
    component: AuthLayout,
  }
];
