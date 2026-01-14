import {Injectable, signal} from '@angular/core';

@Injectable({providedIn: 'root'})
export class ThemeService {
  public isDark = signal(false);

  public toggleTheme(): void {
    this.isDark.update((v) => !v);

    if (this.isDark()) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}
