import {Route} from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('@cinemabooking/core/booking-routing/booking-routing.component').then((c) => c.BookingRoutingComponent),
    children: [
      {
        path: ':screeningId',
        loadComponent: () => import('@cinemabooking/core/booking-routing/views/booking-view/booking-view.component').then((c) => c.BookingViewComponent),
      }
    ],
  },
] satisfies Route[];

