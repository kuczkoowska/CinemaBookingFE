import {FormControl} from '@angular/forms';

export interface RegisterForm {
  readonly firstName: FormControl<string>;
  readonly lastName: FormControl<string>;
  readonly email: FormControl<string>;
  readonly password: FormControl<string>;
  readonly confirmPassword: FormControl<string>;
}
