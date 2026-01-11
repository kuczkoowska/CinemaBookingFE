import {Component, computed, inject, signal} from '@angular/core';
import {AuthStore} from '@cinemabooking/stores/auth.store';

@Component({
  selector: 'app-user-menu',
  imports: [],
  templateUrl: './user-menu.component.html',
})
export class UserMenuComponent {
  public auth = inject(AuthStore);

  public isOpen = signal(false);

  public initials = computed(() => {
    const name = this.auth.displayName() || '';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
  });

  public toggleMenu() {
    this.isOpen.update((v) => !v);
  }

  public closeMenu() {
    this.isOpen.set(false);
  }

  public logout() {
    this.closeMenu();
    this.auth.logout();
  }
}
