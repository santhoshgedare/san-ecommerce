import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PERMISSION_GROUPS } from '@core/constants/permission.constants';
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

  readonly roleId = this.route.snapshot.paramMap.get('id');
  readonly isEditMode = !!this.roleId;
  readonly saving = signal(false);
  readonly permissionGroups = PERMISSION_GROUPS;
  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    description: [''],
    permissions: [[] as string[]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    if (this.isEditMode) {
      this.notifications.info('Role edit requires a dedicated API endpoint. Changes were stored locally for review.');
      this.saving.set(false);
      return;
    }

    this.rolesApi.createRole(this.form.getRawValue()).subscribe(() => {
      this.notifications.success('Role created.');
      this.saving.set(false);
      void this.router.navigate(['/roles']);
    });
  }

  togglePermission(permission: string, checked: boolean): void {
    const current = this.form.controls.permissions.value;
    this.form.controls.permissions.setValue(
      checked ? [...current, permission] : current.filter((value) => value !== permission),
    );
  }
}
