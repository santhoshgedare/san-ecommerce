import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

import { PermissionService } from '@core/authorization/permission';

export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const permissionService = inject(PermissionService);
  const router = inject(Router);
  const permissions = (route.data['permissions'] as string[] | undefined) ?? [];
  return permissions.length === 0 || permissionService.hasAny(permissions)
    ? true
    : router.createUrlTree(['/403']);
};
