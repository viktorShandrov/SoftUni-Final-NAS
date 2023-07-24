import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  FormGroup,
} from '@angular/forms';

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const rePass = control.get('rePass');
    if (password?.value !== rePass?.value) {
      control.get('rePass')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      control.get('rePass')?.setErrors(null);
      return null;
    }
  };
}
