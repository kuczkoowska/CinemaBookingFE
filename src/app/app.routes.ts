import {Routes} from '@angular/router';
import {authGuard} from '@cinemabooking/guards/auth.guard';
import {adminGuard} from '@cinemabooking/guards/admin.guard';
import {activeAccountGuard} from '@cinemabooking/guards/active-account.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shell/shell.component').then((c) => c.ShellComponent),
    children: [
      {
        path: '',
        loadChildren: () => import('./core/home-routing/home.routes'),
      },
      {
        path: 'login',
        loadChildren: () => import('./core/login-routing/login.routes')
      },
      {
        path: 'showtimes',
        loadChildren: () => import('./core/movie-list-routing/movie.routes')
      },
      {
        path: 'admin',
        loadChildren: () => import('./core/admin-routing/admin.routes'),
        canActivate: [adminGuard],
      },
      {
        path: 'profile',
        loadChildren: () => import('./core/profile-routing/profile.routes'),
        canActivate: [authGuard, activeAccountGuard],
      },
    ],
  },
  {
    path: 'booking',
    loadChildren: () => import('./core/booking-routing/booking.routes'),
    canActivate: [authGuard, activeAccountGuard],
  },
  {
    path: 'account-suspended',
    loadComponent: () =>
      import('./core/account-suspended/account-suspended.component').then((c) => c.AccountSuspendedComponent,),
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./core/unauthorized/unauthorized.component').then((c) => c.UnauthorizedComponent),
  },
  {
    path: '404',
    loadComponent: () =>
      import('./core/not-found/not-found.component').then((c) => c.NotFoundComponent),
  },
  {
    path: '**',
    redirectTo: '/404',
  },
];
