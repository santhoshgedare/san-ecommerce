import { Injectable, computed, inject } from '@angular/core';

import { APP_NAVIGATION } from '@core/constants/navigation.constants';
import { NavigationItem } from '@core/models/navigation.models';
import { PermissionService } from '@core/authorization/permission';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly permissionService = inject(PermissionService);
  readonly menu = computed(() => this.filterItems(APP_NAVIGATION));

  private filterItems(items: readonly NavigationItem[]): NavigationItem[] {
    return items
      .filter((item) => this.permissionService.canAccess(item.permissions, item.roles))
      .map((item) => ({
        ...item,
        children: item.children ? this.filterItems(item.children) : undefined,
      }));
  }
}
