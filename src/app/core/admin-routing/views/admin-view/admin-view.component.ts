import {Component, inject} from '@angular/core';
import {AuthStore} from '@cinemabooking/stores/auth.store';
import {DatePipe} from '@angular/common';
import {ADMIN_MENU_ITEMS} from '@cinemabooking/const/admin-menu-items.constants';
import {StatsComponent} from '@cinemabooking/core/admin-routing/views/admin-view/components/stats/stats.component';
import {
  MenuItemComponent
} from '@cinemabooking/core/admin-routing/views/admin-view/components/menu-item/menu-item.component';
import {RefreshButtonComponent} from '@cinemabooking/ui/refresh-button/refresh-button.component';
import {StatItem} from '@cinemabooking/interfaces/ui/stat-item';

@Component({
  selector: 'app-admin-view',
  imports: [
    DatePipe,
    StatsComponent,
    MenuItemComponent,
    RefreshButtonComponent
  ],
  templateUrl: './admin-view.component.html',
})
export class AdminViewComponent {
  protected readonly auth = inject(AuthStore);
  protected readonly today = new Date();

  protected readonly menuItems = ADMIN_MENU_ITEMS;

  protected readonly stats: StatItem[] = [
    {
      label: 'Dzisiejsza sprzedaż',
      value: '1,240 PLN',
      icon: 'pi pi-ticket',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      label: 'Nowi użytkownicy',
      value: '+12',
      icon: 'pi pi-user-plus',
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    {
      label: 'Aktywne seanse',
      value: '8',
      icon: 'pi pi-video',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    {
      label: 'Błędy (24h)',
      value: '0',
      icon: 'pi pi-exclamation-circle',
      color: 'text-red-500',
      bg: 'bg-red-500/10'
    }
  ];
}
