import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shell/shell.component').then((c) => c.ShellComponent),
    children: [
      {
        path: '',
        loadChildren: () => import('./core/home-routing/home.routes')
      },
      {
        path: 'login',
        loadChildren: () => import('./core/login-routing/login.routes')
      },
      {
        path: 'movies',
        loadChildren: () => import('./core/movie-list-routing/movie.routes')
      },
      {
        path: 'booking',
        loadChildren: () => import('./core/booking-routing/booking.routes')
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/'
  },
];
