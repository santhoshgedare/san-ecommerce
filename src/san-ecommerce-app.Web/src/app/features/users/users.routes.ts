import { Routes } from '@angular/router';

import { APP_PERMISSIONS } from '@core/constants/permission.constants';
import { permissionGuard } from '@core/guards/permission-guard';
import { DeletedUsersPage } from './pages/deleted-users-page/deleted-users-page';
import { UserDetailPage } from './pages/user-detail-page/user-detail-page';
import { UserFormPage } from './pages/user-form-page/user-form-page';
import { UserListPage } from './pages/user-list-page/user-list-page';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    component: UserListPage,
    canActivate: [permissionGuard],
    data: { breadcrumb: 'nav.users', permissions: [APP_PERMISSIONS.usersView] },
  },
  {
    path: 'new',
    component: UserFormPage,
    canActivate: [permissionGuard],
    data: { breadcrumb: 'nav.addUser', permissions: [APP_PERMISSIONS.usersCreate] },
  },
  {
    path: 'deleted',
    component: DeletedUsersPage,
    canActivate: [permissionGuard],
    data: { breadcrumb: 'nav.deletedUsers', permissions: [APP_PERMISSIONS.usersRestore] },
  },
  {
    path: ':id/edit',
    component: UserFormPage,
    canActivate: [permissionGuard],
    data: { breadcrumb: 'users.editTitle', permissions: [APP_PERMISSIONS.usersEdit] },
  },
  {
    path: ':id',
    component: UserDetailPage,
    canActivate: [permissionGuard],
    data: { breadcrumb: 'users.detailTitle', permissions: [APP_PERMISSIONS.usersView] },
  },
];
