import { Routes } from '@angular/router';
import { Layout } from './layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'sales',
        loadComponent: () => import('./pages/sales/sales').then(c => c.default),
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/products/products').then(c => c.default),
      },
      {
        path: 'products-list',
        loadComponent: () =>
          import('./pages/products-list/products-list').then(c => c.default),
      },
      {
        path: 'product-receive',
        loadComponent: () =>
          import('./pages/product-receive/product-receive').then(c => c.default),
      },
      {
        path: 'labels',
        loadComponent: () => import('./pages/labels/labels').then(c => c.default),
      },
      {
        path: 'suppliers',
        loadComponent: () =>
          import('./pages/suppliers/suppliers').then(c => c.default),
      },
      { path: '', redirectTo: '/sales', pathMatch: 'full' },
    ],
  },
];
