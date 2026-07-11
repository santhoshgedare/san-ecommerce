import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';

import { AuthService } from '@core/authentication/auth';
import { UpdateUserRequest, User } from '@core/models/user.models';
import { NotificationService } from '@core/services/notification';
import { DataTable } from '@shared/components/data-table/data-table';
import { DeleteDialog } from '@shared/components/delete-dialog/delete-dialog';
import { PageHeader } from '@shared/components/page-header/page-header';
import { DataTableAction, DataTableColumn } from '@shared/models/data-table.models';
import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';
import { AssignRolesDialog } from '../../dialogs/assign-roles-dialog/assign-roles-dialog';
import { ResetPasswordDialog } from '../../dialogs/reset-password-dialog/reset-password-dialog';
import { UserFilters, UserFiltersValue } from '../../components/user-filters/user-filters';
import { UsersApiService } from '../../services/users-api.service';

@Component({
  selector: 'app-user-list-page',
  imports: [UserFilters, DataTable, PageHeader, SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './user-list-page.html',
  styleUrl: './user-list-page.scss',
})
export class UserListPage {
  private readonly usersApi = inject(UsersApiService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly notifications = inject(NotificationService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  readonly users = signal<User[]>([]);
  readonly loading = signal(true);
  readonly filters = signal<UserFiltersValue>({ search: '', status: 'all', department: 'all' });
  readonly availableRoles = ['Administrator', 'Manager', 'Employee'];
  readonly columns: DataTableColumn[] = [
    { key: 'fullName', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'department', label: 'Department' },
    { key: 'roles', label: 'Roles', cell: (row) => String(row['roles'] ?? '—') },
    { key: 'status', label: 'Status' },
  ];
  readonly actions: DataTableAction[] = [
    { id: 'view', label: 'View', icon: 'visibility' },
    { id: 'edit', label: 'Edit', icon: 'edit' },
    { id: 'roles', label: 'Assign roles', icon: 'shield' },
    { id: 'reset', label: 'Reset password', icon: 'lock_reset' },
    { id: 'toggle', label: 'Activate or deactivate', icon: 'toggle_on' },
    { id: 'delete', label: 'Delete', icon: 'delete' },
  ];
  readonly rows = computed(() =>
    this.users()
      .filter((user) => {
        const filters = this.filters();
        const matchesSearch =
          !filters.search ||
          [user.fullName, user.email, user.department ?? '', user.employeeCode ?? '']
            .join(' ')
            .toLowerCase()
            .includes(filters.search.toLowerCase());
        const matchesStatus =
          filters.status === 'all' ||
          (filters.status === 'active' ? user.isActive : !user.isActive);
        const matchesDepartment =
          filters.department === 'all' || user.department === filters.department;
        return matchesSearch && matchesStatus && matchesDepartment;
      })
      .map((user) => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        department: user.department ?? '—',
        roles: user.roles.join(', '),
        status: user.isActive ? 'Active' : 'Inactive',
        entity: user,
      })),
  );

  constructor() {
    this.load();
  }

  applyFilters(filters: UserFiltersValue): void {
    this.filters.set(filters);
  }

  handleAction(event: { actionId: string; row: Record<string, unknown> }): void {
    const user = event.row['entity'];
    if (!this.isUser(user)) {
      return;
    }

    switch (event.actionId) {
      case 'view':
        void this.router.navigate(['/users', user.id]);
        break;
      case 'edit':
        void this.router.navigate(['/users', user.id, 'edit']);
        break;
      case 'roles':
        this.openAssignRoles(user);
        break;
      case 'reset':
        this.resetPassword(user.email);
        break;
      case 'toggle':
        this.toggleUser(user);
        break;
      case 'delete':
        this.deleteUser(user);
        break;
    }
  }

  private load(): void {
    this.loading.set(true);
    this.usersApi.listUsers().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((users) => {
      this.users.set(users);
      this.loading.set(false);
    });
  }

  private deleteUser(user: User): void {
    this.dialog
      .open(DeleteDialog, { data: { itemName: user.fullName, itemType: 'user' } })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.usersApi.deleteUser(user.id).subscribe(() => {
          this.notifications.success('User deleted successfully.');
          this.load();
        });
      });
  }

  private openAssignRoles(user: User): void {
    this.dialog
      .open(AssignRolesDialog, {
        data: { availableRoles: this.availableRoles, selectedRoles: user.roles },
      })
      .afterClosed()
      .subscribe((roles: string[] | undefined) => {
        if (!roles) return;
        const toAdd = roles.filter((role) => !user.roles.includes(role));
        const toRemove = user.roles.filter((role) => !roles.includes(role));
        const requests = [
          ...toAdd.map((role) => this.usersApi.assignRole(user.id, role)),
          ...toRemove.map((role) => this.usersApi.removeRole(user.id, role)),
        ];
        (requests.length ? forkJoin(requests) : of([])).subscribe(() => {
          this.notifications.success('Roles updated.');
          this.load();
        });
      });
  }

  private resetPassword(email: string): void {
    this.dialog
      .open(ResetPasswordDialog, { data: email })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.authService.forgotPassword({ email }).subscribe(() => {
          this.notifications.success('Password reset email queued.');
        });
      });
  }

  private toggleUser(user: User): void {
    const payload: UpdateUserRequest = {
      firstName: user.firstName,
      lastName: user.lastName,
      employeeCode: user.employeeCode,
      department: user.department,
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage,
      isActive: !user.isActive,
    };
    this.usersApi.updateUser(user.id, payload).subscribe(() => {
      this.notifications.success(`User ${payload.isActive ? 'activated' : 'deactivated'}.`);
      this.load();
    });
  }

  private isUser(value: unknown): value is User {
    return typeof value === 'object' && value !== null && 'id' in value && 'email' in value;
  }
}
