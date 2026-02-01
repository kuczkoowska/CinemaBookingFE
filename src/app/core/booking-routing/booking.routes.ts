import {Route} from '@angular/router';
import {BookingStore} from '@cinemabooking/stores/booking.store';
import {BookingStepRoute} from '@cinemabooking/enums/booking-steps.enum';

export default [
  {
    path: '',
    loadComponent: () => import('@cinemabooking/core/booking-routing/booking-routing.component')
      .then((c) => c.BookingRoutingComponent),
    providers: [BookingStore],
    children: [
      {
        path: ':screeningId',
        loadComponent: () => import('@cinemabooking/core/booking-routing/views/booking-view/booking-view.component').then((c) => c.BookingViewComponent),
        children: [
          {
            path: '',
            redirectTo: BookingStepRoute.SEATS,
            pathMatch: 'full'
          },
          {
            path: BookingStepRoute.SEATS,
            loadComponent: () => import('@cinemabooking/core/booking-routing/views/booking-view/views/seats-view/screening-seats.component').then((c) => c.ScreeningSeatsComponent),
          },
          {
            path: BookingStepRoute.TICKETS,
            loadComponent: () => import('@cinemabooking/core/booking-routing/views/booking-view/views/tickets-view/booking-tickets.component').then((c) => c.BookingTicketsComponent),
          },
          {
            path: BookingStepRoute.CONTACT,
            loadComponent: () => import('@cinemabooking/core/booking-routing/views/booking-view/views/contact-view/contact-view.component').then((c) => c.ContactViewComponent),
          }
        ]
      },
      {
        path: `:screeningId/${BookingStepRoute.SUMMARY}`,
        loadComponent: () => import('@cinemabooking/core/booking-routing/views/summary-view/summary-view.component').then((c) => c.SummaryViewComponent)
      }
    ],
  },
] satisfies Route[];
