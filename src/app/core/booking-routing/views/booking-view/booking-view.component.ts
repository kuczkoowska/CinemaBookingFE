import {Component, inject, OnInit} from '@angular/core';
import {
  MovieCardBookingComponent
} from '@cinemabooking/core/booking-routing/views/booking-view/components/movie-card-booking/movie-card-booking.component';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {BookingStore} from '@cinemabooking/stores/booking.store';
import {SpinnerComponent} from '@cinemabooking/ui/spinner/spinner.component';
import {AppRoute} from '@cinemabooking/enums/app-routes';

@Component({
  selector: 'app-booking-view',
  imports: [MovieCardBookingComponent, RouterOutlet, SpinnerComponent],
  templateUrl: './booking-view.component.html',
})
export class BookingViewComponent implements OnInit {
  protected readonly store = inject(BookingStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public ngOnInit(): void {
    const screeningId = Number(this.route.snapshot.paramMap.get('screeningId'));
    this.store.loadBookingData(screeningId);
  }

  // POPRAWIC
  public cancelAndGoHome(): void {
    const bookingId = this.store.activeBooking()?.id;
    if (bookingId) {
      this.store.cancelAndGoBack();
    }
    this.router.navigate([AppRoute.HOME]);
  }

  public changeScreening(): void {
    const bookingId = this.store.activeBooking()?.id;
    if (bookingId) {
      this.store.cancelBookingSilent(bookingId);
    }
    this.router.navigate([AppRoute.MOVIES]);
  }
}
