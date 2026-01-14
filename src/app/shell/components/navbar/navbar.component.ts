import {Component, inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {AppRoute} from '@cinemabooking/enums/app-routes';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NavLink} from '@cinemabooking/interfaces/other/nav-link';
import {authStore} from '@cinemabooking/stores/auth.store';
import {UserMenuComponent} from '@cinemabooking/ui/user-menu/user-menu.component';
import {ThemeService} from '@cinemabooking/services/theme.service';
import {Button} from 'primeng/button';
import {Tooltip} from 'primeng/tooltip';


@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive,
    UserMenuComponent,
    Button,
    Tooltip
  ],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  protected readonly AppRoute = AppRoute;
  private document = inject(DOCUMENT);
  protected themeService = inject(ThemeService);

  public auth = inject(authStore);

  public isLightTheme = false;

  public readonly navLinks: NavLink[] = [
    {label: 'Repertuar', route: AppRoute.MOVIES},
    {label: 'Cennik', route: AppRoute.PRICING},
    {label: 'Kontakt', route: AppRoute.CONTACT}
  ];

  public ngOnInit(): void {
    this.auth.checkAuth();
  }

  public toggleTheme(): void {
    this.isLightTheme = !this.isLightTheme;
    const body = this.document.body;

    if (this.isLightTheme) {
      body.classList.add('light-theme');
    } else {
      body.classList.remove('light-theme');
    }
  }
}
