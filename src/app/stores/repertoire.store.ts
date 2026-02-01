import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { map, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { Screening } from '@cinemabooking/interfaces/screening';
import { ScreeningService } from '@cinemabooking/services/screening.service';
import { RepertoireItem } from '@cinemabooking/interfaces/repertoire-item';
import { formatDate } from '@angular/common';

interface RepertoireState {
  selectedDate: Date;
  movies: RepertoireItem[];
  isLoading: boolean;
}

const initialState: RepertoireState = {
  selectedDate: new Date(),
  movies: [],
  isLoading: false,
};

export const RepertoireStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store, screeningService = inject(ScreeningService)) => ({
    changeDate(date: Date): void {
      patchState(store, { selectedDate: date });
      this.loadRepertoire(date);
    },

    loadRepertoire: rxMethod<Date>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((date) => {
          const dateStr = formatDate(date, 'yyyy-MM-dd', 'en-US');

          return screeningService.getScreenings(dateStr).pipe(
            map((screenings: Screening[]) => groupScreeningsByMovie(screenings)),

            tapResponse({
              next: (items) => patchState(store, { movies: items, isLoading: false }),
              error: (err) => {
                console.error(err);
                patchState(store, { movies: [], isLoading: false });
              },
            }),
          );
        }),
      ),
    ),
  })),
);

function groupScreeningsByMovie(screenings: Screening[]): RepertoireItem[] {
  const map = new Map<number, RepertoireItem>();

  screenings.forEach((screening) => {
    const movieId = screening.movieId;

    if (!map.has(movieId)) {
      map.set(movieId, {
        movie: {
          id: screening.movieId,
          title: screening.movieTitle,
          posterUrl: screening.moviePosterUrl,
          description: screening.movieDescription,
          durationMinutes: screening.movieDurationMinutes,
          genre: screening.movieGenre,
          ageRating: screening.movieAgeRating,
          director: '',
        },
        screenings: [],
      });
    }

    map.get(movieId)!.screenings.push(screening);
  });

  return Array.from(map.values());
}
