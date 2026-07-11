import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '@core/authentication/auth';
import { NotificationService } from '@core/services/notification';
import { ValidationMessage } from '@shared/components/validation-message/validation-message';
import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';
import { matchFieldsValidator } from '@shared/validators/match-fields.validator';
import { passwordStrengthValidator } from '@shared/validators/password-strength.validator';

@Component({
  selector: 'app-reset-password-page',
  imports: [ValidationMessage, SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './reset-password-page.html',
  styleUrl: './reset-password-page.scss',
})
export class ResetPasswordPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);

  readonly isSubmitting = signal(false);
  readonly form = this.formBuilder.nonNullable.group(
    {
      email: ['', [Validators.required, Validators.email]],
      token: [this.route.snapshot.queryParamMap.get('token') ?? '', [Validators.required]],
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
    this.authService.resetPassword(this.form.getRawValue()).subscribe({
      next: (response) => {
        this.notificationService.success(response.message);
        this.isSubmitting.set(false);
      },
      error: () => {
        this.notificationService.error('Unable to reset password.');
        this.isSubmitting.set(false);
      },
    });
  }
}
