import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BookingStore } from '@cinemabooking/stores/booking.store';

@Component({
  selector: 'app-booking-routing',
  imports: [RouterOutlet],
  templateUrl: './booking-routing.component.html',
})
export class BookingRoutingComponent implements OnInit, OnDestroy {
  private readonly store = inject(BookingStore);

  public ngOnInit(): void {
    this.store.resetBookingState();
  }

  public ngOnDestroy(): void {
    const booking = this.store.activeBooking();
    const isFinished = this.store.isFinished();

    if (booking && !isFinished) {
      this.store.cancelBookingOnExit(booking.id);
    }

    this.store.resetBookingState();
  }
}
