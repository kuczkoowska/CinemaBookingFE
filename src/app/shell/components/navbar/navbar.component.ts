import {Component, inject} from '@angular/core';
import {DOCUMENT, NgOptimizedImage} from '@angular/common';
import {AppRoute} from '@cinemabooking/enums/app-routes';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NavLink} from '@cinemabooking/interfaces/nav-link';


@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage
  ],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  // mock
  public isLightTheme = false;
  public isLoggedIn = false;

  public readonly navLinks: NavLink[] = [
    {label: 'Repertuar', route: AppRoute.MOVIES},
    {label: 'Cennik', route: AppRoute.PRICING},
    {label: 'Kontakt', route: AppRoute.CONTACT}
  ];
  protected readonly AppRoute = AppRoute;
  private document = inject(DOCUMENT);

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
