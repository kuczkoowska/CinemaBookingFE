import {Component, effect, inject} from '@angular/core';
import {Router} from '@angular/router';
import {BookingStore} from '@cinemabooking/stores/booking.store';
import {interval, map, Observable, startWith, takeWhile} from 'rxjs';
import {AsyncPipe, CommonModule} from '@angular/common';
import {NotificationService} from '@cinemabooking/services/notification.service';

import {MessageModule} from 'primeng/message';
import {TagModule} from 'primeng/tag';

@Component({
  selector: 'app-expiration-timer',
  imports: [CommonModule, AsyncPipe, MessageModule, TagModule],
  templateUrl: './expiration-timer.component.html',
})
export class ExpirationTimerComponent {
  readonly store = inject(BookingStore);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  public constructor() {
    effect((): void => {
      if (this.store.isExpired() && !this.store.isFinished()) {
        this.notificationService.showError(
          'Czas minął',
          'Czas na rezerwację minął. Przekierowywanie do repertuaru...',
        );
        setTimeout(() => {
          this.router.navigate(['/showtimes']);
        }, 2000);
      }
    });
  }

  readonly timeLeft$: Observable<string> = interval(1000).pipe(
    startWith(0),
    takeWhile(() => !this.store.isExpired(), true),
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
