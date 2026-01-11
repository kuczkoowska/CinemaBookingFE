import {Component, inject, OnInit} from '@angular/core';
import {DOCUMENT, NgOptimizedImage} from '@angular/common';
import {AppRoute} from '@cinemabooking/enums/app-routes';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NavLink} from '@cinemabooking/interfaces/nav-link';
import {AuthStore} from '@cinemabooking/stores/auth.store';
import {UserMenuComponent} from '@cinemabooking/ui/user-menu/user-menu.component';


@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage,
    UserMenuComponent
  ],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  protected readonly AppRoute = AppRoute;
  private document = inject(DOCUMENT);

  public auth = inject(AuthStore);

  public isLightTheme = false;

  public readonly navLinks: NavLink[] = [
    {label: 'Repertuar', route: AppRoute.MOVIES},
    {label: 'Cennik', route: AppRoute.PRICING},
    {label: 'Kontakt', route: AppRoute.CONTACT}
  ];

  ngOnInit(): void {
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
