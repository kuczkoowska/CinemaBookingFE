import {Component, inject} from '@angular/core';
import {BookingStore} from '@cinemabooking/stores/booking.store';
import {Router} from '@angular/router';
import {
  PaymentMethod,
  PaymentMethodSelectorComponent,
} from '@cinemabooking/core/booking-routing/views/summary-view/components/payment-method-selector/payment-method-selector.component';
import {
  BookingConfirmationComponent
} from '@cinemabooking/core/booking-routing/views/summary-view/components/booking-confirmation/booking-confirmation.component';
import {
  BookingSummaryCardComponent
} from '@cinemabooking/core/booking-routing/views/summary-view/components/booking-summary-card/booking-summary-card.component';
import {AppRoute} from '@cinemabooking/enums/app-routes';
import {
  BookingStepperComponent
} from '@cinemabooking/core/booking-routing/views/booking-view/components/booking-stepper/booking-stepper.component';
import {ButtonModule} from 'primeng/button';
import {Location} from '@angular/common';

@Component({
  selector: 'app-summary-view',
  imports: [
    BookingConfirmationComponent,
    BookingSummaryCardComponent,
    PaymentMethodSelectorComponent,
    BookingStepperComponent,
    ButtonModule,
  ],
  templateUrl: './summary-view.component.html',
})
export class SummaryViewComponent {
  public readonly store = inject(BookingStore);
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  public paymentMethod: PaymentMethod = 'BLIK';

  public pay(): void {
    this.store.submitTicketTypesAndPay({
      onSuccess: (): void => {
        this.store.markAsFinished();
      }
    });
  }

  public goBack(): void {
    this.location.back();
  }

  public goHome(): void {
    this.router.navigate([AppRoute.MOVIES]);
  }

  public viewBooking(): void {
    this.router.navigate([AppRoute.HOME]);
  }
}
