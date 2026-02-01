import { Route } from '@angular/router';
import { BookingStore } from '@cinemabooking/stores/booking.store';

export default [
  {
    path: '',
    providers: [BookingStore],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@cinemabooking/core/profile-routing/views/profile-view/profile-view.component').then(
            (c) => c.ProfileViewComponent,
          ),
      },
      {
        path: 'edit',
        loadComponent: () =>
          import('@cinemabooking/core/profile-routing/views/edit-view/edit-view.component').then(
            (c) => c.EditViewComponent,
          ),
      },
      {
        path: 'booking/:bookingId',
        loadComponent: () =>
          import('@cinemabooking/core/profile-routing/views/booking-details-view/booking-details-view.component').then(
            (c) => c.BookingDetailsViewComponent,
          ),
      },
    ],
  },
] satisfies Route[];
