import { Routes } from '@angular/router';

import { AdminLayout } from '@app/layouts/admin-layout/admin-layout';
import { AuthLayout } from '@app/layouts/auth-layout/auth-layout';
import { authGuard } from '@core/guards/auth-guard';
import { guestGuard } from '@core/guards/guest-guard';
import { AccessDenied } from '@shared/components/access-denied/access-denied';
import { Unauthorized } from '@shared/components/unauthorized/unauthorized';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayout,
    canActivate: [guestGuard],
    loadChildren: () => import('@features/auth/auth.routes').then((module) => module.AUTH_ROUTES),
  },
  {
    path: '',
    component: AdminLayout,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadChildren: () => import('@features/dashboard/dashboard.routes').then((module) => module.DASHBOARD_ROUTES),
      },
      {
        path: 'users',
        loadChildren: () => import('@features/users/users.routes').then((module) => module.USERS_ROUTES),
      },
      {
        path: 'roles',
        loadChildren: () => import('@features/roles/roles.routes').then((module) => module.ROLES_ROUTES),
      },
      {
        path: 'permissions',
        loadChildren: () => import('@features/permissions/permissions.routes').then((module) => module.PERMISSIONS_ROUTES),
      },
      {
        path: 'profile',
        loadChildren: () => import('@features/profile/profile.routes').then((module) => module.PROFILE_ROUTES),
      },
      {
        path: 'settings',
        loadChildren: () => import('@features/settings/settings.routes').then((module) => module.SETTINGS_ROUTES),
      },
      {
        path: 'change-password',
        loadComponent: () => import('@features/auth/pages/change-password-page/change-password-page').then((module) => module.ChangePasswordPage),
        data: { breadcrumb: 'nav.changePassword' },
      },
    ],
  },
  { path: '401', component: Unauthorized },
  { path: '403', component: AccessDenied },
  { path: '404', loadComponent: () => import('@features/error/pages/not-found-page').then((module) => module.NotFoundPage) },
  { path: '500', loadComponent: () => import('@features/error/pages/server-error-page').then((module) => module.ServerErrorPage) },
  { path: '**', redirectTo: '404' },
];
