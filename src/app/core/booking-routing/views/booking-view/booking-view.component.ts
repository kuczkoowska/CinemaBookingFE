import {Component, inject, OnInit} from '@angular/core';
import {
  MovieCardBookingComponent
} from '@cinemabooking/core/booking-routing/views/booking-view/components/movie-card-booking/movie-card-booking.component';
import {ActivatedRoute} from '@angular/router';
import {bookingStore} from '@cinemabooking/stores/booking-store';
import {ProgressSpinner} from 'primeng/progressspinner';

@Component({
  selector: 'app-booking-view',
  imports: [
    MovieCardBookingComponent,
    ProgressSpinner,
  ],
  providers: [bookingStore],
  templateUrl: './booking-view.component.html',
})
export class BookingViewComponent implements OnInit {
  protected readonly store = inject(bookingStore);
  private readonly route = inject(ActivatedRoute);

  public ngOnInit(): void {
    const screeningId = Number(this.route.snapshot.paramMap.get('screeningId'));
    this.store.loadBookingData(screeningId);
  }
}
