import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

import { ApiUrlService } from '@core/services/api-url';
import { CreateRoleRequest, Role, UpdateRoleRequest } from '@core/models/role.models';
import { APP_PERMISSIONS } from '@core/constants/permission.constants';

const ALL_PERMISSIONS = Object.values(APP_PERMISSIONS);

const MOCK_ROLES: Role[] = [
  { id: '8c0f4d8a-0b08-4d43-9d84-dca412c5a111', name: 'Administrator', description: 'Full platform access.', permissions: ALL_PERMISSIONS },
  {
    id: 'ecae71a2-91f9-4c25-b16f-19448b847222',
    name: 'Manager',
    description: 'Operational oversight.',
    permissions: [
      APP_PERMISSIONS.dashboardView,
      APP_PERMISSIONS.usersView,
      APP_PERMISSIONS.usersCreate,
      APP_PERMISSIONS.usersEdit,
      APP_PERMISSIONS.usersAssignRoles,
      APP_PERMISSIONS.rolesView,
      APP_PERMISSIONS.permissionsView,
      APP_PERMISSIONS.profileView,
      APP_PERMISSIONS.settingsManage,
    ],
  },
  { id: 'e9321e7a-36b0-44bb-944d-76b1a13e3333', name: 'Employee', description: 'Standard business operations.', permissions: [APP_PERMISSIONS.dashboardView, APP_PERMISSIONS.profileView] },
];

@Injectable({ providedIn: 'root' })
export class RolesApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(ApiUrlService);

  listRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl.roles()).pipe(catchError(() => of(MOCK_ROLES)));
  }

  getRole(id: string): Observable<Role | null> {
    return this.http.get<Role>(this.apiUrl.roles(id)).pipe(catchError(() => of(MOCK_ROLES.find((role) => role.id === id) ?? null)));
  }

  createRole(request: CreateRoleRequest): Observable<Role> {
    return this.http.post<Role>(this.apiUrl.roles(), request).pipe(
      catchError(() => of({ id: crypto.randomUUID(), name: request.name, description: request.description, permissions: request.permissions })),
    );
  }

  updateRole(id: string, request: UpdateRoleRequest): Observable<Role> {
    return this.http.put<Role>(this.apiUrl.roles(id), request).pipe(
      catchError(() => of({ id, name: request.name, description: request.description, permissions: request.permissions })),
    );
  }

  deleteRole(id: string): Observable<void> {
    return this.http.delete<void>(this.apiUrl.roles(id)).pipe(catchError(() => of(void 0)));
  }
}
