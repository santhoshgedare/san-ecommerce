import { Component, inject } from '@angular/core';

import { PermissionCatalogService } from '../../services/permission-catalog.service';
import { PageHeader } from '@shared/components/page-header/page-header';
import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';

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
  readonly treeData: PermissionTreeNode[] = this.catalog.groups.map((group) => ({
    label: group.labelKey,
    children: group.permissions.map((permission) => ({ label: permission.labelKey })),
  }));
  readonly roles = Object.keys(this.catalog.roleMatrix);
  readonly childrenAccessor = (node: PermissionTreeNode) => node.children ?? [];
  readonly hasChild = (_: number, node: PermissionTreeNode) => !!node.children?.length;

  hasPermission(role: string, permission: string): boolean {
    return (this.catalog.roleMatrix[role] ?? []).includes(permission as never);
  }
}
