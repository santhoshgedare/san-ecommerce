import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CreateUserRequest, UpdateUserRequest } from '@core/models/user.models';
import { NotificationService } from '@core/services/notification';
import { PageHeader } from '@shared/components/page-header/page-header';
import { ValidationMessage } from '@shared/components/validation-message/validation-message';
import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';
import { matchFieldsValidator } from '@shared/validators/match-fields.validator';
import { passwordStrengthValidator } from '@shared/validators/password-strength.validator';
import { UsersApiService } from '../../services/users-api.service';

@Component({
  selector: 'app-user-form-page',
  imports: [RouterLink, PageHeader, ValidationMessage, SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './user-form-page.html',
  styleUrl: './user-form-page.scss',
})
export class UserFormPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly usersApi = inject(UsersApiService);
  private readonly notifications = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly userId = this.route.snapshot.paramMap.get('id');
  readonly isEditMode = !!this.userId;
  readonly isSaving = signal(false);
  readonly roles = ['Administrator', 'Manager', 'Employee'];
  readonly departments = ['Operations', 'Sales', 'Support', 'Finance', 'Marketing'];
  readonly form = this.formBuilder.nonNullable.group(
    {
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.isEditMode ? [] : [Validators.required, passwordStrengthValidator()]],
      confirmPassword: ['', this.isEditMode ? [] : [Validators.required]],
      employeeCode: [''],
      department: ['Operations', [Validators.required]],
      phoneNumber: [''],
      roles: [['Employee'] as string[]],
    },
    { validators: matchFieldsValidator('password', 'confirmPassword') },
  );

  constructor() {
    if (this.userId) {
      this.usersApi
        .getUserById(this.userId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((user) => {
          if (!user) return;
          this.form.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            employeeCode: user.employeeCode ?? '',
            department: user.department ?? 'Operations',
            phoneNumber: user.phoneNumber ?? '',
            roles: user.roles,
          });
          this.form.controls.email.disable();
        });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    if (this.isEditMode && this.userId) {
      const payload: UpdateUserRequest = {
        firstName: this.form.controls.firstName.value,
        lastName: this.form.controls.lastName.value,
        employeeCode: this.form.controls.employeeCode.value || null,
        department: this.form.controls.department.value || null,
        phoneNumber: this.form.controls.phoneNumber.value || null,
        profileImage: null,
        isActive: true,
      };
      this.usersApi.updateUser(this.userId, payload).subscribe(() => this.finish('User updated.'));
      return;
    }

    const payload: CreateUserRequest = {
      firstName: this.form.controls.firstName.value,
      lastName: this.form.controls.lastName.value,
      email: this.form.controls.email.value,
      password: this.form.controls.password.value,
      confirmPassword: this.form.controls.confirmPassword.value,
      employeeCode: this.form.controls.employeeCode.value || null,
      department: this.form.controls.department.value || null,
      phoneNumber: this.form.controls.phoneNumber.value || null,
      roles: this.form.controls.roles.value,
    };
    this.usersApi.createUser(payload).subscribe(() => this.finish('User created.'));
  }

  private finish(message: string): void {
    this.notifications.success(message);
    this.isSaving.set(false);
    void this.router.navigate(['/users']);
  }
}
