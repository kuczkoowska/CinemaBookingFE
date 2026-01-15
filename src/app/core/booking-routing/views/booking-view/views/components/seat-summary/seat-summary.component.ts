import {Component, inject} from '@angular/core';
import {Button} from 'primeng/button';
import {BookingStore} from '@cinemabooking/stores/booking-store';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-seat-summary',
  imports: [
    Button
  ],
  templateUrl: './seat-summary.component.html',
})
export class SeatSummaryComponent {
  public store = inject(BookingStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);


  nextStep() {
    this.store.lockSeats()
    this.router.navigate(['../tickets'], {relativeTo: this.route});
  }
}
