import {Route} from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('@cinemabooking/core/movie-list-routing/movie-list-routing.component').then((c) => c.MovieListRoutingComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('@cinemabooking/core/movie-list-routing/views/movie-list-view/movie-list-view.component').then((c) => c.MovieListViewComponent),
      },
      {
        path: ':id',
        loadComponent: () => import('@cinemabooking/core/movie-list-routing/views/movie-details-view/movie-details-view.component').then((c) => c.MovieDetailsViewComponent),
      },
    ],
  },
] satisfies Route[];

