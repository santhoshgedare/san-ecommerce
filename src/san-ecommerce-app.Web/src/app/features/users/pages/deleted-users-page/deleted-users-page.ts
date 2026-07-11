import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DataTable } from '@shared/components/data-table/data-table';
import { PageHeader } from '@shared/components/page-header/page-header';
import { DataTableAction, DataTableColumn } from '@shared/models/data-table.models';
import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';
import { UpdateUserRequest, User } from '@core/models/user.models';
import { NotificationService } from '@core/services/notification';
import { UsersApiService } from '../../services/users-api.service';

@Component({
  selector: 'app-deleted-users-page',
  imports: [DataTable, PageHeader, SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './deleted-users-page.html',
  styleUrl: './deleted-users-page.scss',
})
export class DeletedUsersPage {
  private readonly usersApi = inject(UsersApiService);
  private readonly notifications = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);
  readonly users = signal<User[]>([]);
  readonly columns: DataTableColumn[] = [
    { key: 'fullName', label: 'Name' },
    { key: 'department', label: 'Department' },
    { key: 'email', label: 'Email' },
  ];
  readonly actions: DataTableAction[] = [{ id: 'restore', label: 'Restore', icon: 'restore' }];
  readonly rows = computed(() =>
    this.users()
      .filter((user) => !user.isActive)
      .map((user) => ({ fullName: user.fullName, department: user.department ?? '—', email: user.email, entity: user })),
  );

  constructor() {
    this.usersApi.listUsers().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((users) => this.users.set(users));
  }

  restore(event: { actionId: string; row: Record<string, unknown> }): void {
    const user = event.row['entity'];
    if (!this.isUser(user) || event.actionId !== 'restore') return;
    const payload: UpdateUserRequest = {
      firstName: user.firstName,
      lastName: user.lastName,
      employeeCode: user.employeeCode,
      department: user.department,
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage,
      isActive: true,
    };
    this.usersApi.updateUser(user.id, payload).subscribe(() => {
      this.notifications.success('User restored.');
      this.users.update((users) => users.map((entry) => (entry.id === user.id ? { ...entry, isActive: true } : entry)));
    });
  }

  private isUser(value: unknown): value is User {
    return typeof value === 'object' && value !== null && 'id' in value && 'email' in value;
  }
}
