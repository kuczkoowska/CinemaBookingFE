import {Component, inject, OnDestroy} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {BookingStore} from '@cinemabooking/stores/booking.store';

@Component({
  selector: 'app-booking-routing',
  imports: [RouterOutlet],
  templateUrl: './booking-routing.component.html',
})
export class BookingRoutingComponent implements OnDestroy {
  private readonly store = inject(BookingStore);

  public ngOnDestroy(): void {
    const booking = this.store.activeBooking();
    const isFinished = this.store.isFinished();

    if (booking && !isFinished) {
      this.store.cancelBookingOnExit(booking.id);
    }
  }
}
