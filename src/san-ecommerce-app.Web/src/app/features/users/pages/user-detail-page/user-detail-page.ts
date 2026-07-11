import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { User } from '@core/models/user.models';
import { EmptyState } from '@shared/components/empty-state/empty-state';
import { PageHeader } from '@shared/components/page-header/page-header';
import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';
import { UserRolesPanel } from '../../components/user-roles-panel/user-roles-panel';
import { UsersApiService } from '../../services/users-api.service';

@Component({
  selector: 'app-user-detail-page',
  imports: [EmptyState, PageHeader, UserRolesPanel, SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './user-detail-page.html',
  styleUrl: './user-detail-page.scss',
})
export class UserDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly usersApi = inject(UsersApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly user = signal<User | null>(null);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.usersApi
      .getUserById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => this.user.set(user));
  }
}
