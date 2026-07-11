import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

import { ApiUrlService } from '@core/services/api-url';
import { CreateUserRequest, UpdateUserRequest, User } from '@core/models/user.models';

const MOCK_USERS: User[] = [
  {
    id: '1f57dd11-63e1-455f-b271-b17c0c7ef101',
    firstName: 'Ava',
    lastName: 'Stone',
    fullName: 'Ava Stone',
    email: 'ava.stone@sancommerce.test',
    phoneNumber: '+1 555-0101',
    employeeCode: 'EMP-1001',
    department: 'Operations',
    profileImage: null,
    isActive: true,
    createdOn: '2026-01-10T09:00:00Z',
    roles: ['Administrator'],
  },
  {
    id: '58e843de-927f-4bf9-9da5-bf33b3f52202',
    firstName: 'Liam',
    lastName: 'Nguyen',
    fullName: 'Liam Nguyen',
    email: 'liam.nguyen@sancommerce.test',
    phoneNumber: '+1 555-0102',
    employeeCode: 'EMP-1002',
    department: 'Sales',
    profileImage: null,
    isActive: true,
    createdOn: '2026-02-18T09:00:00Z',
    roles: ['Manager'],
  },
  {
    id: '293ff76f-d2a7-40de-b126-af2c103e1303',
    firstName: 'Mia',
    lastName: 'Garcia',
    fullName: 'Mia Garcia',
    email: 'mia.garcia@sancommerce.test',
    phoneNumber: '+1 555-0103',
    employeeCode: 'EMP-1003',
    department: 'Support',
    profileImage: null,
    isActive: false,
    createdOn: '2026-03-22T09:00:00Z',
    roles: ['Employee'],
  },
];

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(ApiUrlService);

  listUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl.users()).pipe(catchError(() => of(MOCK_USERS)));
  }

  getUserById(id: string): Observable<User | null> {
    return this.http.get<User>(this.apiUrl.users(id)).pipe(
      map((user) => user),
      catchError(() => of(MOCK_USERS.find((user) => user.id === id) ?? null)),
    );
  }

  createUser(request: CreateUserRequest): Observable<User> {
    return this.http.post<User>(this.apiUrl.users(), request).pipe(
      catchError(() =>
        of({
          ...request,
          id: crypto.randomUUID(),
          fullName: `${request.firstName} ${request.lastName}`,
          profileImage: null,
          isActive: true,
          createdOn: new Date().toISOString(),
        }),
      ),
    );
  }

  updateUser(id: string, request: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(this.apiUrl.users(id), request).pipe(
      catchError(() =>
        this.getUserById(id).pipe(
          map((user) => ({
            ...(user ?? MOCK_USERS[0]),
            ...request,
            id,
            fullName: `${request.firstName} ${request.lastName}`,
            email: user?.email ?? 'updated@sancommerce.test',
            roles: user?.roles ?? ['Employee'],
            createdOn: user?.createdOn ?? new Date().toISOString(),
          })),
        ),
      ),
    );
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(this.apiUrl.users(id)).pipe(catchError(() => of(void 0)));
  }

  assignRole(id: string, roleName: string): Observable<void> {
    return this.http.post<void>(this.apiUrl.users(`${id}/roles/${roleName}`), {}).pipe(catchError(() => of(void 0)));
  }

  removeRole(id: string, roleName: string): Observable<void> {
    return this.http.delete<void>(this.apiUrl.users(`${id}/roles/${roleName}`)).pipe(catchError(() => of(void 0)));
  }
}
