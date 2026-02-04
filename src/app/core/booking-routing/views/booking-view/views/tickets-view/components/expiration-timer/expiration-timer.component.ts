import {Component, effect, inject, OnDestroy, signal} from '@angular/core';
import {Router} from '@angular/router';
import {BookingStore} from '@cinemabooking/stores/booking.store';
import {DatePipe} from '@angular/common';

import {MessageModule} from 'primeng/message';
import {TagModule} from 'primeng/tag';

@Component({
  selector: 'app-expiration-timer',
  imports: [DatePipe, MessageModule, TagModule],
  templateUrl: './expiration-timer.component.html',
})
export class ExpirationTimerComponent implements OnDestroy {
  protected readonly store = inject(BookingStore);
  private readonly router = inject(Router);
  protected readonly timeDiff = signal<number>(0);

  private intervalId: ReturnType<typeof setInterval>;
  private timeoutId: ReturnType<typeof setTimeout>;

  public constructor() {
    this.startTimer();

    effect(() => {
      if (this.timeDiff() <= 0 && this.store.expirationTime() && !this.store.isFinished()) {
        this.stopTimer();
        this.timeoutId = setTimeout(() => this.router.navigate(['/']), 2000);
      }
    });
  }

  public ngOnDestroy(): void {
    this.stopTimer();
    clearTimeout(this.timeoutId);
  }

  private startTimer(): void {
    this.updateTimer();
    this.intervalId = setInterval(() => this.updateTimer(), 1000);
  }

  private stopTimer(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  private updateTimer(): void {
    const expString = this.store.expirationTime();
    if (!expString) return;

    const diff = new Date(expString).getTime() - Date.now();
    // zapobiega liczbom ujemnym
    this.timeDiff.set(Math.max(0, diff));
  }
}
