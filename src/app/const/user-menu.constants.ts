import {MenuItem} from 'primeng/api';
import {UserMenuActions} from '@cinemabooking/interfaces/other/user-menu-actions';

export function getUserMenuItems(
  isAdmin: boolean,
  isActive: boolean,
  actions: UserMenuActions,
): MenuItem[] {
  const items: MenuItem[] = [];

  if (isAdmin) {
    items.push({
      label: 'Panel Administratora',
      icon: 'pi pi-shield',
      command: () => actions.onAdminPanel(),
    });
    items.push({separator: true});
  }

  if (!isActive) {
    items.push(
      {
        label: 'Konto zawieszone',
        icon: 'pi pi-lock',
        disabled: true,
        styleClass: 'text-orange-500',
      },
      {separator: true},
    );
  }

  items.push(
    {
      label: 'Mój profil',
      icon: 'pi pi-user',
      routerLink: '/profile',
      disabled: !isActive,
    },
    {
      label: 'Edytuj profil',
      icon: 'pi pi-cog',
      routerLink: '/profile/edit',
      disabled: !isActive,
    },
    {separator: true},
    {
      label: 'Wyloguj',
      icon: 'pi pi-sign-out',
      command: () => actions.onLogout(),
    },
  );

  return items;
}
