import { Injectable, computed, inject } from '@angular/core';

import { AuthService } from '@core/authentication/auth';
import { ROLE_PERMISSION_MAP } from '@core/constants/permission.constants';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly authService = inject(AuthService);

  readonly permissions = computed(() => {
    const session = this.authService.session();
    if (!session) {
      return [] as string[];
    }

    const derived = session.roles.flatMap((role) => ROLE_PERMISSION_MAP[role] ?? []);
    return Array.from(new Set([...(session.permissions ?? []), ...derived]));
  });

  has(permission: string): boolean {
    return this.permissions().includes(permission);
  }

  hasAny(permissions: readonly string[]): boolean {
    return permissions.some((permission) => this.has(permission));
  }

  hasRole(role: string): boolean {
    return this.authService.session()?.roles.includes(role) ?? false;
  }

  canAccess(permissions?: readonly string[], roles?: readonly string[]): boolean {
    if (roles?.length && !roles.some((role) => this.hasRole(role))) {
      return false;
    }
    if (permissions?.length && !this.hasAny(permissions)) {
      return false;
    }
    return true;
  }
}
