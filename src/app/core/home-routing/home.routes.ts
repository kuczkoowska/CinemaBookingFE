import {Route} from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('@cinemabooking/core/home-routing/home-routing.component').then((c) => c.HomeRoutingComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('@cinemabooking/core/home-routing/views/home-view/home-view.component').then((c) => c.HomeViewComponent),
        children: [
          {
            path: '',
            loadComponent: () => import('@cinemabooking/core/home-routing/views/home-view/views/movie-list-view/movie-list-view.component').then((c) => c.MovieListViewComponent),
          },
          {
            path: 'movie/:id',
            loadComponent: () => import('@cinemabooking/core/home-routing/views/home-view/views/movie-details-view/movie-details-view.component').then((c) => c.MovieDetailsViewComponent),
          },
        ]
      },
      {
        path: 'contact',
        loadComponent: () => import('@cinemabooking/core/home-routing/views/contact-view/contact-view.component').then((c) => c.ContactViewComponent),
      },
      {
        path: 'pricing',
        loadComponent: () => import('@cinemabooking/core/home-routing/views/pricing-view/pricing-view.component').then((c) => c.PricingViewComponent),
      }
    ],
  },
] satisfies Route[];

