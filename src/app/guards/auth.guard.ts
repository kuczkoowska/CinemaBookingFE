import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthStore} from '@cinemabooking/stores/auth.store';

export const authGuard: CanActivateFn = (state): boolean => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login'], {
    queryParams: {returnUrl: state.url},
  });
  
  return false;
};
