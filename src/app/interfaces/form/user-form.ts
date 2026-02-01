import { FormControl } from '@angular/forms';

export interface UserForm {
  readonly firstName: FormControl<string>;
  readonly lastName: FormControl<string>;
  readonly email: FormControl<string>;
}
