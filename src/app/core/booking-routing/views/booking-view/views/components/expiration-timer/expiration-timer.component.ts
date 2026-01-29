import {Component, inject} from '@angular/core';
import {BookingStore} from '@cinemabooking/stores/booking.store';
import {interval, map, Observable, startWith} from 'rxjs';
import {AsyncPipe, CommonModule} from '@angular/common';


import {MessageModule} from 'primeng/message';
import {TagModule} from 'primeng/tag';

@Component({
  selector: 'app-expiration-timer',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    MessageModule,
    TagModule
  ],
  templateUrl: './expiration-timer.component.html',
})
export class ExpirationTimerComponent {
  readonly store = inject(BookingStore);

  readonly timeLeft$: Observable<string> = interval(1000).pipe(
    startWith(0),
    map(() => {
      const expString = this.store.expirationTime();
      if (!expString) return '00:00';

      const distance = new Date(expString).getTime() - new Date().getTime();

      if (distance <= 0) return '00:00';

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      return `${this.pad(minutes)}:${this.pad(seconds)}`;
    })
  );

  private pad(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
}
