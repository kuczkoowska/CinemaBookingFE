import {FormControl} from '@angular/forms';

export interface MovieFilterForm {
  readonly searchQuery: FormControl<string>;
  readonly genre: FormControl<string | null>;
  readonly hideAdult: FormControl<boolean>;
}
