import {Route} from '@angular/router';
import {BookingStore} from '@cinemabooking/stores/booking.store';

export default [
  {
    path: '',
    loadComponent: () => import('@cinemabooking/core/booking-routing/booking-routing.component').then((c) => c.BookingRoutingComponent),
    providers: [BookingStore],
    children: [
      {
        path: ':screeningId',
        loadComponent: () => import('@cinemabooking/core/booking-routing/views/booking-view/booking-view.component').then((c) => c.BookingViewComponent),
        children: [
          {
            path: '',
            redirectTo: 'seats',
            pathMatch: 'full'
          },
          {
            path: 'seats',
            loadComponent: () => import('@cinemabooking/core/booking-routing/views/booking-view/views/screening-seats/screening-seats.component').then((c) => c.ScreeningSeatsComponent),
          },
          {
            path: 'tickets',
            loadComponent: () => import('@cinemabooking/core/booking-routing/views/booking-view/views/booking-tickets/booking-tickets.component').then((c) => c.BookingTicketsComponent),
          },
        ]
      },
      {
        path: ':screeningId/summary',
        loadComponent: () => import('@cinemabooking/core/booking-routing/views/summary-view/summary-view.component').then((c) => c.SummaryViewComponent)
      }
    ],
  },
] satisfies Route[];

