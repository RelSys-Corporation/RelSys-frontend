import { CompanyLayout } from '../../layout/company-layout/company-layout';
import { authGuard } from './../../core/guards/auth-guard/auth-guard';
import { Routes } from '@angular/router';
import { AuthLayout } from '../../layout/auth-layout/auth-layout';
import { MainLayout } from '../../layout/main-layout/main-layout';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('../../layout/auth-layout/auth-layout').then(component => component.AuthLayout)
  },
  {
    path: 'company',
    loadComponent: () => import('../../layout/company-layout/company-layout').then(component => component.CompanyLayout)
  },
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'user/view',
        loadComponent: () => import('./pages/user/view-user/view-user').then(component => component.ViewUser)
      },
      {
        path: 'role/view',
        loadComponent: () => import('./pages/role/view-role/view-role').then(component => component.ViewRole)
      }
    ]
  }

];
