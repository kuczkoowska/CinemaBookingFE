import {Component, computed, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {BookingStore} from '@cinemabooking/stores/booking-store';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {Select} from 'primeng/select';
import {TooltipModule} from 'primeng/tooltip';
import {ExpirationTimerComponent} from '../components/expiration-timer/expiration-timer.component';

@Component({
  selector: 'app-booking-tickets-step',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    AutoCompleteModule,
    ExpirationTimerComponent,
    Select
  ],
  templateUrl: './booking-tickets.component.html',
})
export class BookingTicketsComponent {
  public store = inject(BookingStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public ticketOptions = computed(() => {
    const prices = this.store.prices();

    return Object.entries(prices).map(([type, price]) => ({
      label: `${this.formatLabel(type)} (${price} PLN)`,
      value: type,
      price: price
    }));
  });

  goBack() {
    this.store.cancelAndGoBack();
    this.router.navigate(['../seats'], {relativeTo: this.route});
  }

  private formatLabel(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  }

  private isTransactionContinued = false;

  finishBooking() {

    this.store.submitTicketTypesAndPay().subscribe({
      next: () => {
        this.isTransactionContinued = true;
        this.router.navigate(['../summary'], {relativeTo: this.route});
      },
      error: () => {
      }
    });
  }

  ngOnDestroy() {
    if (!this.isTransactionContinued) {
      const booking = this.store.activeBooking();

      if (booking) {
        console.log('Użytkownik uciekł! Zwalniam miejsca w tle...');

        this.store.cancelBookingSilent(booking.id);
      }
    }
  }
}
