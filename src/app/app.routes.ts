import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shell/shell.component').then((c) => c.ShellComponent),
    children: [
      {
        path: '',
        loadChildren: () => import('./core/home-routing/home.routes')
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/'
  },
];
