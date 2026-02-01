import { FormControl } from '@angular/forms';

export interface RoomForm {
  readonly name: FormControl<string>;
  readonly rows: FormControl<number>;
  readonly seatsPerRow: FormControl<number>;
}
