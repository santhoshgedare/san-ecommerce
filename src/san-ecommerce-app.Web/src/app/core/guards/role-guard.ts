import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

import { PermissionService } from '@core/authorization/permission';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const permissionService = inject(PermissionService);
  const router = inject(Router);
  const roles = (route.data['roles'] as string[] | undefined) ?? [];
  return roles.length === 0 || roles.some((role) => permissionService.hasRole(role))
    ? true
    : router.createUrlTree(['/403']);
};
