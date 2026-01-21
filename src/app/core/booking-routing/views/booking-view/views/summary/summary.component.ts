import {Component, inject} from '@angular/core';
import {BookingStore} from '@cinemabooking/stores/booking-store';
import {Router} from '@angular/router';
import {RadioButtonModule} from 'primeng/radiobutton';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-summary',
  imports: [
    RadioButtonModule,
    FormsModule,
  ],
  templateUrl: './summary.component.html',
})
export class SummaryComponent {
  public store = inject(BookingStore);
  private router = inject(Router);

  public paymentMethod: 'BLIK' | 'CARD' = 'BLIK';
  public blikCode: string = '';

  public pay(): void {
    this.store.finalizePayment();
  }

  public goHome(): void {
    this.router.navigate(['/']);
  }
}
