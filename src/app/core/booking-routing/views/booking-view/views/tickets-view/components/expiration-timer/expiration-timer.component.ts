import {Component, effect, inject, OnDestroy, signal} from '@angular/core';
import {Router} from '@angular/router';
import {BookingStore} from '@cinemabooking/stores/booking.store';
import {CommonModule} from '@angular/common';

import {MessageModule} from 'primeng/message';
import {TagModule} from 'primeng/tag';

@Component({
  selector: 'app-expiration-timer',
  imports: [CommonModule, MessageModule, TagModule],
  templateUrl: './expiration-timer.component.html',
})
export class ExpirationTimerComponent implements OnDestroy {
  protected readonly store = inject(BookingStore);
  private readonly router = inject(Router);
  protected readonly timeDiff = signal<number>(0);

  private readonly intervalId = setInterval(() => this.updateTimer(), 1000);

  public constructor() {
    this.updateTimer();

    effect((): void => {
      if (this.timeDiff() <= 0 && this.store.activeBooking() && !this.store.isFinished()) {
        clearInterval(this.intervalId);
        setTimeout(() => this.router.navigate(['/']), 2000);
      }
    });
  }

  public ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  private updateTimer(): void {
    const expString = this.store.expirationTime();
    if (!expString) return;

    const diff = new Date(expString).getTime() - Date.now();
    // zapobiega liczbom ujemnym
    this.timeDiff.set(Math.max(0, diff));
  }
}
