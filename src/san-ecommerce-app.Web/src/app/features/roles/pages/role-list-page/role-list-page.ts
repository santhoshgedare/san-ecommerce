import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';

import { APP_PERMISSIONS } from '@core/constants/permission.constants';
import { DataTable } from '@shared/components/data-table/data-table';
import { DeleteDialog } from '@shared/components/delete-dialog/delete-dialog';
import { PageHeader } from '@shared/components/page-header/page-header';
import { HasPermissionDirective } from '@shared/directives/has-permission';
import { DataTableAction, DataTableColumn } from '@shared/models/data-table.models';
import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';
import { NotificationService } from '@core/services/notification';
import { Role } from '@core/models/role.models';
import { RolesApiService } from '../../services/roles-api.service';

@Component({
  selector: 'app-role-list-page',
  imports: [RouterLink, DataTable, PageHeader, HasPermissionDirective, SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './role-list-page.html',
  styleUrl: './role-list-page.scss',
})
export class RoleListPage {
  private readonly rolesApi = inject(RolesApiService);
  private readonly dialog = inject(MatDialog);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly roles = signal<Role[]>([]);
  readonly columns: DataTableColumn[] = [
    { key: 'name', label: 'Role', sortable: true },
    { key: 'description', label: 'Description' },
    { key: 'permissions', label: 'Permissions' },
  ];
  readonly actions: DataTableAction[] = [
    { id: 'edit', label: 'Edit', icon: 'edit', permission: APP_PERMISSIONS.rolesManage },
    { id: 'delete', label: 'Delete', icon: 'delete', permission: APP_PERMISSIONS.rolesManage },
  ];

  constructor() {
    this.rolesApi.listRoles().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((roles) => this.roles.set(roles));
  }

  get rows(): Record<string, unknown>[] {
    return this.roles().map((role) => ({
      name: role.name,
      description: role.description ?? '—',
      permissions: `${role.permissions.length} assigned`,
      entity: role,
    }));
  }

  handleAction(event: { actionId: string; row: Record<string, unknown> }): void {
    const role = event.row['entity'];
    if (!this.isRole(role)) return;
    if (event.actionId === 'edit') {
      void this.router.navigate(['/roles', role.id, 'edit']);
      return;
    }
    this.dialog.open(DeleteDialog, { data: { itemName: role.name, itemType: 'role' } }).afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.rolesApi.deleteRole(role.id).subscribe(() => {
        this.notifications.success('Role deleted.');
        this.roles.update((roles) => roles.filter((entry) => entry.id !== role.id));
      });
    });
  }

  private isRole(value: unknown): value is Role {
    return typeof value === 'object' && value !== null && 'id' in value && 'name' in value;
  }
}
