import {Component, input, output} from '@angular/core';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-booking-confirmation',
  imports: [Button],
  templateUrl: './booking-confirmation.component.html',
})
export class BookingConfirmationComponent {
  public readonly bookingId = input.required<number>();
  public readonly goHome = output<void>();
  public readonly viewBooking = output<void>();
}
