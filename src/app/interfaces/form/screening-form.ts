import { FormControl } from '@angular/forms';

export interface ScreeningForm {
  readonly movieId: FormControl<number | null>;
  readonly theaterRoomId: FormControl<number | null>;
  readonly startTime: FormControl<Date | null>;
}
