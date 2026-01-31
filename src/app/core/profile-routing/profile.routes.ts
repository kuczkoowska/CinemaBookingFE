import {Route} from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('@cinemabooking/core/profile-routing/views/profile-view/profile-view.component').then((c) => c.ProfileViewComponent),
  },
  {
    path: 'edit',
    loadComponent: () => import('@cinemabooking/core/profile-routing/views/edit-view/edit-view.component').then((c) => c.EditViewComponent)
  }
] satisfies Route[];

