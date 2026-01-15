import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {ButtonModule} from 'primeng/button';
import {BookingStore} from '@cinemabooking/stores/booking-store';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {
  ExpirationTimerComponent
} from '@cinemabooking/core/booking-routing/views/booking-view/views/components/expiration-timer/expiration-timer.component';


@Component({
  selector: 'app-booking-tickets-step',
  imports: [CommonModule, FormsModule, ButtonModule, AutoCompleteModule, ExpirationTimerComponent],
  templateUrl: './booking-tickets.component.html',
})
export class BookingTicketsComponent {
  public store = inject(BookingStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public ticketOptions: any[] = [
    {label: 'Normalny (25 PLN)', value: 'NORMAL', price: 25},
    {label: 'Ulgowy (18 PLN)', value: 'REDUCED', price: 18}
  ];

  goBack() {
    this.router.navigate(['../seats'], {relativeTo: this.route});
  }
}
