import {Route} from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('@cinemabooking/core/home-routing/home-routing.component').then((c) => c.HomeRoutingComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('@cinemabooking/core/home-routing/views/home-view/home-view.component').then((c) => c.HomeViewComponent),
      },
    ],
  },
] satisfies Route[];

