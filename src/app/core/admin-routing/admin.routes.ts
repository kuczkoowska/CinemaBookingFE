import {Route} from '@angular/router';

export default [
  {
    path: '',
    canActivate: [], //admin guard do dodania
    loadComponent: () => import('@cinemabooking/core/booking-routing/booking-routing.component').then((c) => c.BookingRoutingComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('@cinemabooking/core/admin-routing/views/admin-view/admin-view.component').then((c) => c.AdminViewComponent),
      },
      {
        path: 'movies',
        loadComponent: () => import('@cinemabooking/core/admin-routing/views/movies-view/movies-view.component').then((c) => c.MoviesViewComponent),
      },
      {
        path: 'users',
        loadComponent: () => import('@cinemabooking/core/admin-routing/views/users-view/users-view.component').then((c) => c.UsersViewComponent),
      },
      {
        path: 'infrastructure',
        loadComponent: () => import('@cinemabooking/core/admin-routing/views/infrastructure-view/infrastructure-view.component').then((c) => c.InfrastructureViewComponent),
      },
      {
        path: 'logs',
        loadComponent: () => import('@cinemabooking/core/admin-routing/views/logs-view/logs-view.component').then((c) => c.LogsViewComponent),
      },
      {
        path: 'screenings',
        loadComponent: () => import('@cinemabooking/core/admin-routing/views/screenings-view/screenings-view.component').then((c) => c.ScreeningsViewComponent),
      },
      {
        path: 'stats',
        loadComponent: () => import('@cinemabooking/core/admin-routing/views/stats-view/stats-view.component').then((c) => c.StatsViewComponent),
      }
    ],
  },
] satisfies Route[];

