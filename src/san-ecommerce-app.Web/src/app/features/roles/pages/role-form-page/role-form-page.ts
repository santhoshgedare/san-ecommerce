import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { PERMISSION_GROUPS } from '@core/constants/permission.constants';
import { Role } from '@core/models/role.models';
import { NotificationService } from '@core/services/notification';
import { PageHeader } from '@shared/components/page-header/page-header';
import { ValidationMessage } from '@shared/components/validation-message/validation-message';
import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';
import { RolesApiService } from '../../services/roles-api.service';

@Component({
  selector: 'app-role-form-page',
  imports: [PageHeader, ValidationMessage, SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './role-form-page.html',
  styleUrl: './role-form-page.scss',
})
export class RoleFormPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly rolesApi = inject(RolesApiService);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly roleId = this.route.snapshot.paramMap.get('id');
  readonly isEditMode = !!this.roleId;
  readonly saving = signal(false);
  readonly loading = signal(false);
  readonly permissionGroups = PERMISSION_GROUPS;
  readonly pageTitle = computed(() => (this.isEditMode ? 'Edit role' : 'Create role'));
  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    description: [''],
    permissions: [[] as string[]],
  });

  constructor() {
    if (!this.roleId) {
      return;
    }

    this.loading.set(true);
    this.rolesApi
      .getRole(this.roleId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((role) => {
        if (!role) {
          this.notifications.error('Role not found.');
          void this.router.navigate(['/roles']);
          return;
        }

        this.patchForm(role);
      });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const request = this.form.getRawValue();
    const action = this.isEditMode && this.roleId ? this.rolesApi.updateRole(this.roleId, request) : this.rolesApi.createRole(request);

    action
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe(() => {
        this.notifications.success(this.isEditMode ? 'Role updated.' : 'Role created.');
        void this.router.navigate(['/roles']);
      });
  }

  togglePermission(permission: string, checked: boolean): void {
    const current = this.form.controls.permissions.value;
    this.form.controls.permissions.setValue(
      checked ? [...current, permission] : current.filter((value) => value !== permission),
    );
  }

  private patchForm(role: Role): void {
    this.form.patchValue({
      name: role.name,
      description: role.description ?? '',
      permissions: role.permissions,
    });
  }
}
