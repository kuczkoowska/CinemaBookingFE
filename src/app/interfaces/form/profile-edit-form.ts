import {FormControl} from '@angular/forms';

export interface ProfileEditForm {
  readonly email: FormControl<string>;
  readonly firstName: FormControl<string>;
  readonly lastName: FormControl<string>;
}
