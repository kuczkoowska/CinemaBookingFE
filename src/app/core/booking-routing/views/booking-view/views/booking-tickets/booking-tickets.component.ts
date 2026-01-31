import {Component, computed, inject, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {BookingStore} from '@cinemabooking/stores/booking.store';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {Select} from 'primeng/select';
import {TooltipModule} from 'primeng/tooltip';
import {
  ExpirationTimerComponent
} from '@cinemabooking/core/booking-routing/views/booking-view/views/booking-tickets/components/expiration-timer/expiration-timer.component';

@Component({
  selector: 'app-booking-tickets-step',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    AutoCompleteModule,
    ExpirationTimerComponent,
    Select,
  ],
  templateUrl: './booking-tickets.component.html',
})
export class BookingTicketsComponent implements OnDestroy {
  public store = inject(BookingStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private isNavigatingWithIntent = false;

  public ticketOptions = computed(() => {
    const prices = this.store.prices();

    return Object.entries(prices).map(([type, price]) => ({
      label: `${type} (${price} PLN)`,
      value: type,
      price: price,
    }));
  });

  public finishBooking(): void {
    this.isNavigatingWithIntent = true;
    this.router.navigate(['../summary'], {relativeTo: this.route});
  }

  public goBack(): void {
    this.isNavigatingWithIntent = true;
    this.store.cancelAndGoBack();
    this.router.navigate(['../seats'], {relativeTo: this.route});
  }

  public ngOnDestroy(): void {
    if (!this.isNavigatingWithIntent) {
      const bookingId = this.store.activeBooking()?.id;
      if (bookingId) {
        console.warn('Wykryto porzucenie procesu! Zwalniam rezerwację:', bookingId);
        this.store.cancelBookingSilent(bookingId);
      }
    }
  }
}
