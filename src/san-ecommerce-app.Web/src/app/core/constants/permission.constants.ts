import { PermissionGroup } from '@core/models/permission.models';

export const APP_PERMISSIONS = {
  dashboardView: 'dashboard.view',
  usersView: 'users.view',
  usersCreate: 'users.create',
  usersEdit: 'users.edit',
  usersDelete: 'users.delete',
  usersRestore: 'users.restore',
  usersAssignRoles: 'users.assign-roles',
  usersResetPassword: 'users.reset-password',
  rolesView: 'roles.view',
  rolesManage: 'roles.manage',
  permissionsView: 'permissions.view',
  permissionsManage: 'permissions.manage',
  profileView: 'profile.view',
  settingsManage: 'settings.manage',
} as const;

export type PermissionKey = (typeof APP_PERMISSIONS)[keyof typeof APP_PERMISSIONS];

export const PERMISSION_GROUPS: readonly PermissionGroup[] = [
  {
    key: 'dashboard',
    labelKey: 'permissions.groups.dashboard',
    permissions: [
      {
        key: APP_PERMISSIONS.dashboardView,
        labelKey: 'permissions.dashboard.view',
        descriptionKey: 'permissions.dashboard.viewDescription',
        group: 'dashboard',
      },
    ],
  },
  {
    key: 'users',
    labelKey: 'permissions.groups.users',
    permissions: [
      {
        key: APP_PERMISSIONS.usersView,
        labelKey: 'permissions.users.view',
        descriptionKey: 'permissions.users.viewDescription',
        group: 'users',
      },
      {
        key: APP_PERMISSIONS.usersCreate,
        labelKey: 'permissions.users.create',
        descriptionKey: 'permissions.users.createDescription',
        group: 'users',
      },
      {
        key: APP_PERMISSIONS.usersEdit,
        labelKey: 'permissions.users.edit',
        descriptionKey: 'permissions.users.editDescription',
        group: 'users',
      },
      {
        key: APP_PERMISSIONS.usersDelete,
        labelKey: 'permissions.users.delete',
        descriptionKey: 'permissions.users.deleteDescription',
        group: 'users',
      },
      {
        key: APP_PERMISSIONS.usersRestore,
        labelKey: 'permissions.users.restore',
        descriptionKey: 'permissions.users.restoreDescription',
        group: 'users',
      },
      {
        key: APP_PERMISSIONS.usersAssignRoles,
        labelKey: 'permissions.users.assignRoles',
        descriptionKey: 'permissions.users.assignRolesDescription',
        group: 'users',
      },
      {
        key: APP_PERMISSIONS.usersResetPassword,
        labelKey: 'permissions.users.resetPassword',
        descriptionKey: 'permissions.users.resetPasswordDescription',
        group: 'users',
      },
    ],
  },
  {
    key: 'roles',
    labelKey: 'permissions.groups.roles',
    permissions: [
      {
        key: APP_PERMISSIONS.rolesView,
        labelKey: 'permissions.roles.view',
        descriptionKey: 'permissions.roles.viewDescription',
        group: 'roles',
      },
      {
        key: APP_PERMISSIONS.rolesManage,
        labelKey: 'permissions.roles.manage',
        descriptionKey: 'permissions.roles.manageDescription',
        group: 'roles',
      },
    ],
  },
  {
    key: 'permissions',
    labelKey: 'permissions.groups.permissions',
    permissions: [
      {
        key: APP_PERMISSIONS.permissionsView,
        labelKey: 'permissions.permissions.view',
        descriptionKey: 'permissions.permissions.viewDescription',
        group: 'permissions',
      },
      {
        key: APP_PERMISSIONS.permissionsManage,
        labelKey: 'permissions.permissions.manage',
        descriptionKey: 'permissions.permissions.manageDescription',
        group: 'permissions',
      },
    ],
  },
  {
    key: 'settings',
    labelKey: 'permissions.groups.settings',
    permissions: [
      {
        key: APP_PERMISSIONS.profileView,
        labelKey: 'permissions.profile.view',
        descriptionKey: 'permissions.profile.viewDescription',
        group: 'settings',
      },
      {
        key: APP_PERMISSIONS.settingsManage,
        labelKey: 'permissions.settings.manage',
        descriptionKey: 'permissions.settings.manageDescription',
        group: 'settings',
      },
    ],
  },
];
