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


@Component({
  selector: 'app-repertoire',
  standalone: true,
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
  public store = inject(RepertoireStore);

  public weekDays = signal<Date[]>([]);

  public isPast(dateStr: string): boolean {
    const screeningDate = new Date(dateStr);
    const now = new Date();

    return screeningDate < now;
  }

  public ngOnInit(): void {
    this.generateWeekDays();
    this.store.loadRepertoire(this.store.selectedDate());
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

  public selectDate(date: Date): void {
    this.store.changeDate(date);
  }
}
