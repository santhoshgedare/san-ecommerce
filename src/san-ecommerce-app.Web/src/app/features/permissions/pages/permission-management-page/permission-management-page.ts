import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';

import { PermissionCatalogService } from '../../services/permission-catalog.service';
import { PageHeader } from '@shared/components/page-header/page-header';
import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';
import { RolesApiService } from '@features/roles/services/roles-api.service';
import { Role } from '@core/models/role.models';

interface PermissionTreeNode {
  label: string;
  children?: PermissionTreeNode[];
}

@Component({
  selector: 'app-permission-management-page',
  imports: [PageHeader, SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './permission-management-page.html',
  styleUrl: './permission-management-page.scss',
})
export class PermissionManagementPage {
  readonly catalog = inject(PermissionCatalogService);
  private readonly rolesApi = inject(RolesApiService);
  private readonly destroyRef = inject(DestroyRef);
  readonly treeData: PermissionTreeNode[] = this.catalog.groups.map((group) => ({
    label: group.labelKey,
    children: group.permissions.map((permission) => ({ label: permission.labelKey })),
  }));
  readonly roles = signal<Role[]>([]);
  readonly loading = signal(true);
  readonly roleNames = computed(() => this.roles().map((role) => role.name));
  readonly childrenAccessor = (node: PermissionTreeNode) => node.children ?? [];
  readonly hasChild = (_: number, node: PermissionTreeNode) => !!node.children?.length;

  constructor() {
    this.rolesApi
      .listRoles()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((roles) => {
        this.roles.set(roles);
        this.loading.set(false);
      });
  }

  hasPermission(role: string, permission: string): boolean {
    return this.roles()
      .find((entry) => entry.name === role)
      ?.permissions.includes(permission) ?? false;
  }
}
