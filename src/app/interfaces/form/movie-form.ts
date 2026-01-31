import {FormControl} from '@angular/forms';

export interface MovieForm {
  readonly title: FormControl<string>;
  readonly genre: FormControl<string>;
  readonly description: FormControl<string>;
  readonly durationMinutes: FormControl<number>;
  readonly director: FormControl<string>;
  readonly ageRating: FormControl<number>;
  readonly posterUrl: FormControl<string>;
  readonly trailerUrl: FormControl<string | null>;
}
