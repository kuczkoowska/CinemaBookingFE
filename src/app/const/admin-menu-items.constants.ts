export const ADMIN_MENU_ITEMS = [
  {
    title: 'Repertuar Filmowy',
    description: 'Zarządzaj bazą filmów, opisami i plakatami.',
    icon: 'pi pi-video',
    route: '../movies',
    styleClass: 'border-purple-500',
    styleIcons: 'bg-purple-500/10'
  },
  {
    title: 'Harmonogram Seansów',
    description: 'Planuj seanse, przypisuj sale i godziny.',
    icon: 'pi pi-calendar',
    route: '../screenings',
    styleClass: 'border-blue-500',
    styleIcons: 'bg-blue-500/10'

  },
  {
    title: 'Użytkownicy',
    description: 'Zarządzaj kontami, rolami i blokadami.',
    icon: 'pi pi-users',
    route: '../users',
    styleClass: 'border-green-500',
    styleIcons: 'bg-green-500/10'
  },
  {
    title: 'Infrastruktura',
    description: 'Konfiguracja sal kinowych i cenników.',
    icon: 'pi pi-building',
    route: '../infrastructure',
    styleClass: 'border-cyan-500',
    styleIcons: 'bg-cyan-500/10'
  },
  // {
  //   title: 'Statystyki',
  //   description: 'Raporty sprzedaży i popularności.',
  //   icon: 'pi pi-chart-bar',
  //   route: '../stats',
  //   styleClass: 'border-pink-500',
  //   styleIcons: 'bg-pink-500/10'
  // },
  // {
  //   title: 'Logi Systemowe',
  //   description: 'Podgląd błędów i historii zdarzeń.',
  //   icon: 'pi pi-list',
  //   route: '../logs',
  //   styleClass: 'border-orange-500',
  //   styleIcons: 'bg-orange-500/10'
  // }
];
