import {Component, inject} from '@angular/core';
import {BookingStore} from '@cinemabooking/stores/booking-store';
import {
  SeatComponent
} from '@cinemabooking/core/booking-routing/views/booking-view/views/components/seat/seat.component';
import {
  RowNumbersComponent
} from '@cinemabooking/core/booking-routing/views/booking-view/views/components/row-numbers/row-numbers.component';
import {
  OpisComponent
} from '@cinemabooking/core/booking-routing/views/booking-view/views/components/opis/opis.component';
import {
  SeatSummaryComponent
} from '@cinemabooking/core/booking-routing/views/booking-view/views/components/seat-summary/seat-summary.component';

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
  public store = inject(BookingStore);
  public rows = this.store.rows;
}
