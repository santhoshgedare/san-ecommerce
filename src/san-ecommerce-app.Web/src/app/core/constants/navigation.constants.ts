import { APP_PERMISSIONS } from '@core/constants/permission.constants';
import { NavigationItem } from '@core/models/navigation.models';

export const APP_NAVIGATION: readonly NavigationItem[] = [
  {
    labelKey: 'nav.dashboard',
    route: '/dashboard',
    icon: 'dashboard',
    permissions: [APP_PERMISSIONS.dashboardView],
  },
  {
    labelKey: 'nav.users',
    route: '/users',
    icon: 'group',
    permissions: [APP_PERMISSIONS.usersView],
    children: [
      {
        labelKey: 'nav.userList',
        route: '/users',
        icon: 'list',
        permissions: [APP_PERMISSIONS.usersView],
      },
      {
        labelKey: 'nav.addUser',
        route: '/users/new',
        icon: 'person_add',
        permissions: [APP_PERMISSIONS.usersCreate],
      },
      {
        labelKey: 'nav.deletedUsers',
        route: '/users/deleted',
        icon: 'delete_history',
        permissions: [APP_PERMISSIONS.usersRestore],
      },
    ],
  },
  {
    labelKey: 'nav.roles',
    route: '/roles',
    icon: 'admin_panel_settings',
    permissions: [APP_PERMISSIONS.rolesView],
  },
  {
    labelKey: 'nav.permissions',
    route: '/permissions',
    icon: 'shield',
    permissions: [APP_PERMISSIONS.permissionsView],
  },
  {
    labelKey: 'nav.profile',
    route: '/profile',
    icon: 'account_circle',
    permissions: [APP_PERMISSIONS.profileView],
  },
  {
    labelKey: 'nav.settings',
    route: '/settings',
    icon: 'settings',
    permissions: [APP_PERMISSIONS.settingsManage],
  },
];
