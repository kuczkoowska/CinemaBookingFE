import {Component, inject} from '@angular/core';
import {BookingStore} from '@cinemabooking/stores/booking.store';
import {
  SeatComponent
} from '@cinemabooking/core/booking-routing/views/booking-view/views/seats-view/components/seat/seat.component';
import {
  RowNumbersComponent
} from '@cinemabooking/core/booking-routing/views/booking-view/views/seats-view/components/row-numbers/row-numbers.component';
import {
  OpisComponent
} from '@cinemabooking/core/booking-routing/views/booking-view/views/seats-view/components/opis/opis.component';
import {
  SeatSummaryComponent
} from '@cinemabooking/core/booking-routing/views/booking-view/views/seats-view/components/seat-summary/seat-summary.component';

@Component({
  selector: 'app-screening-seats',
  imports: [
    SeatComponent,
    RowNumbersComponent,
    OpisComponent,
    SeatSummaryComponent
  ],
  templateUrl: './screening-seats.component.html',
})
export class ScreeningSeatsComponent {
  protected readonly store = inject(BookingStore);
  protected readonly rows = this.store.rows;
}
