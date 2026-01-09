import {Component} from '@angular/core';
import {
  MovieCardBookingComponent
} from '@cinemabooking/core/booking-routing/views/booking-view/components/movie-card-booking/movie-card-booking.component';

@Component({
  selector: 'app-booking-view',
  imports: [
    MovieCardBookingComponent
  ],
  templateUrl: './booking-view.component.html',
})
export class BookingViewComponent {

}
