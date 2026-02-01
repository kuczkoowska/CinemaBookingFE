import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {ButtonModule} from 'primeng/button';
import {TagModule} from 'primeng/tag';
import {SkeletonModule} from 'primeng/skeleton';
import {repertoireStore} from '@cinemabooking/stores/repertoire.store';
import {
  RepertoireCalendarComponent
} from '@cinemabooking/core/movie-list-routing/repertoire/components/repertoire-calendar/repertoire-calendar.component';
import {
  SkeletonRepertoireComponent
} from '@cinemabooking/core/movie-list-routing/repertoire/components/skeleton-repertoire/skeleton-repertoire.component';
import {
  RepertoireMovieCardComponent
} from '@cinemabooking/core/movie-list-routing/repertoire/components/repertoire-movie-card/repertoire-movie-card.component';
import {AuthStore} from '@cinemabooking/stores/auth.store';
import {Router} from '@angular/router';


@Component({
  selector: 'app-repertoire',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TagModule,
    SkeletonModule,
    RepertoireCalendarComponent,
    SkeletonRepertoireComponent,
    RepertoireMovieCardComponent
  ],
  templateUrl: './repertoire.component.html',
})
export class RepertoireComponent {
  protected readonly store = inject(repertoireStore);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  protected handleScreeningSelect(screeningId: number): void {
    if (!this.authStore.isAuthenticated()) {
      this.router.navigate(['/login'], {
        queryParams: {returnUrl: `/booking/${screeningId}`},
      });

      return;
    }

    const user = this.authStore.user();
    if (user && user.isActive === false) {
      this.router.navigate(['/account-suspended']);

      return;
    }

    this.router.navigate(['/booking', screeningId]);
  }

  protected selectDate(date: Date): void {
    this.store.changeDate(date);
  }

}
