import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '@core/authentication/auth';
import { NotificationService } from '@core/services/notification';
import { ValidationMessage } from '@shared/components/validation-message/validation-message';
import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ValidationMessage, SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  readonly isSubmitting = signal(false);
  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [true],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => this.isSubmitting.set(false),
      error: (error: unknown) => {
        const message =
          error instanceof HttpErrorResponse ? error.error?.detail ?? 'Unable to sign in.' : 'Unable to sign in.';
        this.notificationService.error(message);
        this.isSubmitting.set(false);
      },
    });
  }
}
