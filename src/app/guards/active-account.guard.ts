import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthStore} from '@cinemabooking/stores/auth.store';

export const activeAccountGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const user = authStore.user();

  if (!user) {
    return router.createUrlTree(['/login']);
  }

  if (user.isActive === false) {
    return router.createUrlTree(['/account-suspended']);
  }

  return true;
};
