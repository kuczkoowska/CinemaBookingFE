import {Route} from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('@cinemabooking/core/login-routing/login-routing.component').then((c) => c.LoginRoutingComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('@cinemabooking/core/login-routing/views/login-view/login-view.component').then((c) => c.LoginViewComponent)
      }
    ]
  },
] satisfies Route[];

