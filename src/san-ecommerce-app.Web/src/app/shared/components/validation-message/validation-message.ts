import { AbstractControl } from '@angular/forms';
import { Component, computed, input } from '@angular/core';

import { SHARED_IMPORTS } from '@shared/material/material-imports';

@Component({
  selector: 'app-validation-message',
  imports: [SHARED_IMPORTS],
  templateUrl: './validation-message.html',
  styleUrl: './validation-message.scss',
})
export class ValidationMessage {
  readonly control = input<AbstractControl | null>(null);
  readonly errorMessage = computed(() => {
    const control = this.control();
    if (!control || !control.touched || !control.errors) {
      return '';
    }

    if (control.errors['required']) return 'validation.required';
    if (control.errors['email']) return 'validation.email';
    if (control.errors['minlength']) return 'validation.minlength';
    if (control.errors['fieldMismatch']) return 'validation.fieldMismatch';
    if (control.errors['weakPassword']) return 'validation.weakPassword';
    return 'validation.invalid';
  });
}
