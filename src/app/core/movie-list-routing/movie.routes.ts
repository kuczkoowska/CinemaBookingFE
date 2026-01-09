import {Route} from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('@cinemabooking/core/movie-list-routing/movie-list-routing.component').then((c) => c.MovieListRoutingComponent),
    children: [],
  },
] satisfies Route[];

