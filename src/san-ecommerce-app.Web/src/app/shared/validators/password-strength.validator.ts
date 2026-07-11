import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordStrengthValidator = (): ValidatorFn => {
  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '');
    return value.length === 0 || pattern.test(value) ? null : { weakPassword: true };
  };
};
