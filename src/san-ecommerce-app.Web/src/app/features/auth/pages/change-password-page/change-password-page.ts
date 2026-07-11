import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '@core/authentication/auth';
import { NotificationService } from '@core/services/notification';
import { PageHeader } from '@shared/components/page-header/page-header';
import { ValidationMessage } from '@shared/components/validation-message/validation-message';
import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';
import { matchFieldsValidator } from '@shared/validators/match-fields.validator';
import { passwordStrengthValidator } from '@shared/validators/password-strength.validator';

@Component({
  selector: 'app-change-password-page',
  imports: [PageHeader, ValidationMessage, SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './change-password-page.html',
  styleUrl: './change-password-page.scss',
})
export class ChangePasswordPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly notifications = inject(NotificationService);

  readonly isSubmitting = signal(false);
  readonly form = this.formBuilder.nonNullable.group(
    {
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, passwordStrengthValidator()]],
      confirmNewPassword: ['', [Validators.required]],
    },
    { validators: matchFieldsValidator('newPassword', 'confirmNewPassword') },
  );

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.authService.changePassword(this.form.getRawValue()).subscribe({
      next: () => {
        this.notifications.success('Password changed successfully.');
        this.isSubmitting.set(false);
        this.form.reset();
      },
      error: () => {
        this.notifications.error('Unable to change password.');
        this.isSubmitting.set(false);
      },
    });
  }
}
