import {MenuItem} from 'primeng/api';
import {UserMenuActions} from '@cinemabooking/interfaces/other/user-menu-actions';

export function getUserMenuItems(isAdmin: boolean, actions: UserMenuActions): MenuItem[] {
  const items: MenuItem[] = [];

  if (isAdmin) {
    items.push({
      label: 'Panel Administratora',
      icon: 'pi pi-shield',
      command: () => actions.onAdminPanel()
    });
    items.push({separator: true});
  }

  items.push(
    {
      label: 'Moje bilety',
      icon: 'pi pi-ticket',
      routerLink: '/profile/tickets',
      badge: '2'
    },
    {
      label: 'Ustawienia',
      icon: 'pi pi-cog',
      routerLink: '/profile/settings'
    },
    {separator: true},
    {
      label: 'Wyloguj',
      icon: 'pi pi-sign-out',
      command: () => actions.onLogout()
    }
  );

  return items;
}
