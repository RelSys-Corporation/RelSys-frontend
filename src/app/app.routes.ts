import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: 'main',
    component: MainLayout
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(subRoute => subRoute.authRoutes)
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
