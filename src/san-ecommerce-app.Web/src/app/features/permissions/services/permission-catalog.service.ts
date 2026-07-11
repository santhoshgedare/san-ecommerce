import { Injectable } from '@angular/core';

import { PERMISSION_GROUPS, ROLE_PERMISSION_MAP } from '@core/constants/permission.constants';

@Injectable({ providedIn: 'root' })
export class PermissionCatalogService {
  readonly groups = PERMISSION_GROUPS;
  readonly roleMatrix = ROLE_PERMISSION_MAP;
}
