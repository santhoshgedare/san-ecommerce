import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '@core/authentication/auth';
import { NotificationService } from '@core/services/notification';
import { ValidationMessage } from '@shared/components/validation-message/validation-message';
import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';

@Component({
  selector: 'app-forgot-password-page',
  imports: [RouterLink, ValidationMessage, SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './forgot-password-page.html',
  styleUrl: './forgot-password-page.scss',
})
export class ForgotPasswordPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  readonly isSubmitting = signal(false);
  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.authService.forgotPassword(this.form.getRawValue()).subscribe({
      next: (response) => {
        this.notificationService.success(response.message);
        this.isSubmitting.set(false);
      },
      error: () => {
        this.notificationService.error('Unable to start password reset.');
        this.isSubmitting.set(false);
      },
    });
  }
}
