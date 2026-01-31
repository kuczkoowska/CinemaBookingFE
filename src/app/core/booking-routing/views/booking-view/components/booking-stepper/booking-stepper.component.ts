import {Component, computed, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, startWith} from 'rxjs';
import {CommonModule} from '@angular/common';
import {StepsModule} from 'primeng/steps';
import {MenuItem} from 'primeng/api';

interface BookingStep {
  label: string;
  route: string;
  index: number;
}

@Component({
  selector: 'app-booking-stepper',
  imports: [
    CommonModule,
    StepsModule
  ],
  templateUrl: './booking-stepper.component.html',

})
export class BookingStepperComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private readonly stepsData: BookingStep[] = [
    {label: 'Wybór miejsc', route: 'seats', index: 0},
    {label: 'Bilety', route: 'tickets', index: 1},
    {label: 'Kontakt', route: 'contact', index: 2},
    {label: 'Płatność', route: 'summary', index: 3}
  ];

  protected items = computed<MenuItem[]>(() =>
    this.stepsData.map(s => ({
      label: s.label,
    }))
  );

  private currentRoute = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.getCurrentRouteSegment()),
      startWith(this.getCurrentRouteSegment())
    ),
    {initialValue: 'seats'}
  );

  protected activeStepIndex = computed(() => {
    const route = this.currentRoute();
    const step = this.stepsData.find(s => route.includes(s.route));
    return step ? step.index : 0;
  });

  private getCurrentRouteSegment(): string {
    let currentRoute = this.route;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }
    return currentRoute.snapshot.url.map(segment => segment.path).join('/') || '';
  }
}
