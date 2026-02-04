import {Component, computed, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {BookingStore} from '@cinemabooking/stores/booking.store';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {Select} from 'primeng/select';
import {TooltipModule} from 'primeng/tooltip';
import {
  ExpirationTimerComponent
} from '@cinemabooking/core/booking-routing/views/booking-view/views/tickets-view/components/expiration-timer/expiration-timer.component';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-booking-tickets-step',
  imports: [
    FormsModule,
    ButtonModule,
    TooltipModule,
    AutoCompleteModule,
    ExpirationTimerComponent,
    Select,
    DecimalPipe,
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
      label: `${type} (${price} PLN)`,
      value: type,
      price: price,
    }));
  });

  public finishBooking(): void {
    this.router.navigate(['../contact'], {relativeTo: this.route});
  }

  public goBack(): void {
    this.store.cancelAndGoBack();
    this.router.navigate(['../seats'], {relativeTo: this.route});
  }
}
