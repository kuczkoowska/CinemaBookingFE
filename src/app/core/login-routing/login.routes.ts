import {Route} from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('@cinemabooking/core/login-routing/login-routing.component').then((c) => c.LoginRoutingComponent),
  },
] satisfies Route[];

