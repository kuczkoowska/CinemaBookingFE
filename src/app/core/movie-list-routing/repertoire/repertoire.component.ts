import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

// PrimeNG
import {ButtonModule} from 'primeng/button';
import {TagModule} from 'primeng/tag';
import {SkeletonModule} from 'primeng/skeleton';
import {RepertoireStore} from '@cinemabooking/stores/repertoire.store';
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
export class RepertoireComponent implements OnInit {
  protected readonly store = inject(RepertoireStore);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly weekDays = signal<Date[]>([]);

  public ngOnInit(): void {
    this.generateWeekDays();
    this.store.loadRepertoire(this.store.selectedDate());
  }

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

  private generateWeekDays(): void {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d);
    }
    this.weekDays.set(dates);
  }
}
