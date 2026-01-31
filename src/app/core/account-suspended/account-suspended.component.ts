import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {AuthStore} from '@cinemabooking/stores/auth.store';

@Component({
  selector: 'app-account-suspended',
  imports: [ButtonModule, CardModule, RouterLink],
  templateUrl: './account-suspended.component.html',
})
export class AccountSuspendedComponent {
  private authStore = inject(AuthStore);

  public logout(): void {
    this.authStore.logout();
  }
}
