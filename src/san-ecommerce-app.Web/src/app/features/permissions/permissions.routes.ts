import { Routes } from '@angular/router';

import { APP_PERMISSIONS } from '@core/constants/permission.constants';
import { permissionGuard } from '@core/guards/permission-guard';
import { PermissionManagementPage } from './pages/permission-management-page/permission-management-page';

export const PERMISSIONS_ROUTES: Routes = [
  {
    path: '',
    component: PermissionManagementPage,
    canActivate: [permissionGuard],
    data: { breadcrumb: 'nav.permissions', permissions: [APP_PERMISSIONS.permissionsView] },
  },
];
