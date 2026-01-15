import {Component, inject, OnInit} from '@angular/core';
import {
  MovieCardBookingComponent
} from '@cinemabooking/core/booking-routing/views/booking-view/components/movie-card-booking/movie-card-booking.component';
import {ActivatedRoute, RouterOutlet} from '@angular/router';
import {BookingStore} from '@cinemabooking/stores/booking-store';
import {SpinnerComponent} from '@cinemabooking/ui/spinner/spinner.component';

@Component({
  selector: 'app-booking-view',
  imports: [
    MovieCardBookingComponent,
    RouterOutlet,
    SpinnerComponent,

  ],
  providers: [BookingStore],
  templateUrl: './booking-view.component.html',
})
export class BookingViewComponent implements OnInit {
  protected readonly store = inject(BookingStore);
  private readonly route = inject(ActivatedRoute);

  public ngOnInit(): void {
    const screeningId = Number(this.route.snapshot.paramMap.get('screeningId'));
    this.store.loadBookingData(screeningId);
  }
}
