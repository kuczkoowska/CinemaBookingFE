import {Component, inject} from '@angular/core';
import {AppRoute} from '@cinemabooking/enums/app-routes';
import {Router, RouterLink} from '@angular/router';
import {NavLink} from '@cinemabooking/interfaces/other/nav-link';
import {AuthStore} from '@cinemabooking/stores/auth.store';
import {UserMenuComponent} from '@cinemabooking/ui/user-menu/user-menu.component';
import {ThemeService} from '@cinemabooking/services/theme.service';
import {Button} from 'primeng/button';
import {Tooltip} from 'primeng/tooltip';


@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    UserMenuComponent,
    Button,
    Tooltip
  ],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  protected readonly AppRoute = AppRoute;
  protected themeService = inject(ThemeService);
  protected router = inject(Router);
  public auth = inject(AuthStore);


  public readonly navLinks: NavLink[] = [
    {label: 'Repertuar', route: AppRoute.MOVIES},
    {label: 'Cennik', route: AppRoute.PRICING},
    {label: 'Kontakt', route: AppRoute.CONTACT}
  ];
}
