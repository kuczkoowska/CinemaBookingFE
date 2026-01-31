import {Component, effect, inject, untracked} from '@angular/core';
import {Button} from 'primeng/button';
import {BookingStore} from '@cinemabooking/stores/booking.store';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-seat-summary',
  imports: [
    Button
  ],
  templateUrl: './seat-summary.component.html',
})
export class SeatSummaryComponent {
  protected readonly store = inject(BookingStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);


  public constructor() {
    effect((): void => {
      const booking = this.store.activeBooking();

      if (booking && !this.store.isLoading()) {

        untracked((): void => {
          this.router.navigate(['../tickets'], {relativeTo: this.route});
        });
      }
    });
  }

  public nextStep(): void {
    this.store.lockSeats();
  }
}
