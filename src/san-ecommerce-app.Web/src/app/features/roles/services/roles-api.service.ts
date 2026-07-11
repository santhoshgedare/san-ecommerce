import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

import { ApiUrlService } from '@core/services/api-url';
import { CreateRoleRequest, Role } from '@core/models/role.models';

const MOCK_ROLES: Role[] = [
  { id: '8c0f4d8a-0b08-4d43-9d84-dca412c5a111', name: 'Administrator', description: 'Full platform access.' },
  { id: 'ecae71a2-91f9-4c25-b16f-19448b847222', name: 'Manager', description: 'Operational oversight.' },
  { id: 'e9321e7a-36b0-44bb-944d-76b1a13e3333', name: 'Employee', description: 'Standard business operations.' },
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
      catchError(() => of({ id: crypto.randomUUID(), name: request.name, description: request.description })),
    );
  }

  deleteRole(id: string): Observable<void> {
    return this.http.delete<void>(this.apiUrl.roles(id)).pipe(catchError(() => of(void 0)));
  }
}
