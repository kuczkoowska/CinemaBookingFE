import {Component, computed, inject, viewChild} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {Menu, MenuModule} from 'primeng/menu';
import {AuthStore} from '@cinemabooking/stores/auth.store';
import {getUserMenuItems} from '@cinemabooking/const/user-menu.constants';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [
    MenuModule,
    RouterModule,
    Button
  ],
  templateUrl: './user-menu.component.html',
})
export class UserMenuComponent {
  public auth = inject(AuthStore);
  private router = inject(Router);

  public initials = computed(() => {
    const name = this.auth.displayName() || '';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();

    return name.slice(0, 2).toUpperCase();
  });

  public menu = viewChild<Menu>('menu')

  public menuItems = computed(() =>
    getUserMenuItems(this.auth.isAdmin(), {
      onLogout: () => {
        console.log(this.menu())
        this.menu()?.hide();
        this.auth.logout();
      },

      onAdminPanel: () => {
        this.router.navigate(['/admin/dashboard']);
      },
    })
  );
}
