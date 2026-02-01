import {FormControl} from '@angular/forms';

export interface LoginForm {
  readonly username: FormControl<string>;
  readonly password: FormControl<string>;
}
