import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const matchFieldsValidator = (field: string, confirmField: string): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const fieldControl = control.get(field);
    const confirmControl = control.get(confirmField);

    if (!fieldControl || !confirmControl) {
      return null;
    }

    if (confirmControl.errors && !confirmControl.errors['fieldMismatch']) {
      return null;
    }

    const mismatch = fieldControl.value !== confirmControl.value;
    confirmControl.setErrors(mismatch ? { fieldMismatch: true } : null);
    return mismatch ? { fieldMismatch: true } : null;
  };
};
