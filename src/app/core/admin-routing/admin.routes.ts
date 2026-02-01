import { Route } from '@angular/router';
import { adminGuard } from '@cinemabooking/guards/admin.guard';

export default [
  {
    path: '',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('@cinemabooking/core/admin-routing/admin-routing.component').then(
        (c) => c.AdminRoutingComponent,
      ),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@cinemabooking/core/admin-routing/views/admin-view/admin-view.component').then(
            (c) => c.AdminViewComponent,
          ),
      },
      {
        path: 'movies',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('@cinemabooking/core/admin-routing/views/movies-view/movies-view.component').then(
                (c) => c.MoviesViewComponent,
              ),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('@cinemabooking/core/admin-routing/views/movies-view/components/movie-form/movie-form.component').then(
                (c) => c.MovieFormComponent,
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('@cinemabooking/core/admin-routing/views/movies-view/components/movie-form/movie-form.component').then(
                (c) => c.MovieFormComponent,
              ),
          },
        ],
      },
      {
        path: 'users',
        loadComponent: () =>
          import('@cinemabooking/core/admin-routing/views/users-view/users-view.component').then(
            (c) => c.UsersViewComponent,
          ),
      },
      {
        path: 'logs',
        loadComponent: () =>
          import('@cinemabooking/core/admin-routing/views/logs-view/logs-view.component').then(
            (c) => c.LogsViewComponent,
          ),
      },
      {
        path: 'screenings',
        loadComponent: () =>
          import('@cinemabooking/core/admin-routing/views/screenings-view/screenings-view.component').then(
            (c) => c.ScreeningsViewComponent,
          ),
      },
      {
        path: 'infrastructure',
        loadComponent: () =>
          import('@cinemabooking/core/admin-routing/views/infrastructure-view/infrastructure-view.component').then(
            (c) => c.InfrastructureViewComponent,
          ),
      },
      {
        path: 'stats',
        loadComponent: () =>
          import('@cinemabooking/core/admin-routing/views/stats-view/stats-view.component').then(
            (c) => c.StatsViewComponent,
          ),
      },
    ],
  },
] satisfies Route[];
