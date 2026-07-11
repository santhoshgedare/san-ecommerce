import { Injectable } from '@angular/core';

import { PERMISSION_GROUPS } from '@core/constants/permission.constants';

@Injectable({ providedIn: 'root' })
export class PermissionCatalogService {
  readonly groups = PERMISSION_GROUPS;
}
