import {Component, computed, effect, inject, input, numberAttribute} from '@angular/core';
import {Router} from '@angular/router';
import {Button} from 'primeng/button';
import {DatePipe, DecimalPipe} from '@angular/common';
import {SpinnerComponent} from '@cinemabooking/ui/spinner/spinner.component';
import {Tag} from 'primeng/tag';
import {Divider} from 'primeng/divider';
import {BookingStore} from '@cinemabooking/stores/booking.store';

@Component({
  selector: 'app-booking-details-view',
  imports: [Button, DatePipe, DecimalPipe, SpinnerComponent, Tag, Divider],
  templateUrl: './booking-details-view.component.html',
})
export class BookingDetailsViewComponent {
  protected readonly store = inject(BookingStore);
  private readonly router: Router = inject(Router);

  public readonly bookingId = input.required<number, string>({
    transform: numberAttribute,
  });

  protected readonly statusSeverity = computed(() => {
    const status = this.store.activeBooking()?.status;
    if (status === 'POTWIERDZONA') return 'success';
    if (status === 'OCZEKUJE') return 'warn';
    if (status === 'ANULOWANA') return 'danger';

    return 'info';
  });

  public constructor() {
    effect((): void => {
      this.store.loadBookingById(this.bookingId());
    });
  }

  protected goBack(): void {
    this.router.navigate(['/profile']);
  }
}
