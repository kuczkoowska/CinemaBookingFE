import {Component, computed, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {NavigationEnd, Router} from '@angular/router';
import {filter, map, startWith} from 'rxjs';
import {CommonModule} from '@angular/common';
import {StepsModule} from 'primeng/steps';
import {MenuItem} from 'primeng/api';
import {BOOKING_STEPS_CONFIG} from '@cinemabooking/const/booking-steps.constants';

@Component({
  selector: 'app-booking-stepper',
  imports: [
    CommonModule,
    StepsModule
  ],
  templateUrl: './booking-stepper.component.html',

})
export class BookingStepperComponent {
  private readonly router = inject(Router);

  private readonly stepsConfig = BOOKING_STEPS_CONFIG;

  protected readonly items = computed<MenuItem[]>(() =>
    this.stepsConfig.map((s) => ({label: s.label}))
  );

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e: NavigationEnd) => e.urlAfterRedirects),
      startWith(this.router.url)
    )
  );

  protected readonly activeStepIndex = computed(() => {
    const url = this.currentUrl();
    const index = this.stepsConfig.findIndex((s) => url?.includes(s.route));

    return index !== -1 ? index : 0;
  });
}
