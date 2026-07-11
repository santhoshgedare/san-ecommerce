import { Routes } from '@angular/router';

import { APP_PERMISSIONS } from '@core/constants/permission.constants';
import { permissionGuard } from '@core/guards/permission-guard';
import { RoleFormPage } from './pages/role-form-page/role-form-page';
import { RoleListPage } from './pages/role-list-page/role-list-page';

export const ROLES_ROUTES: Routes = [
  {
    path: '',
    component: RoleListPage,
    canActivate: [permissionGuard],
    data: { breadcrumb: 'nav.roles', permissions: [APP_PERMISSIONS.rolesView] },
  },
  {
    path: 'new',
    component: RoleFormPage,
    canActivate: [permissionGuard],
    data: { breadcrumb: 'roles.createTitle', permissions: [APP_PERMISSIONS.rolesManage] },
  },
  {
    path: ':id/edit',
    component: RoleFormPage,
    canActivate: [permissionGuard],
    data: { breadcrumb: 'roles.editTitle', permissions: [APP_PERMISSIONS.rolesManage] },
  },
];
