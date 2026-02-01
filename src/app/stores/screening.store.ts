import {computed, inject} from '@angular/core';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {Screening} from '@cinemabooking/interfaces/screening';
import {ScreeningService} from '@cinemabooking/services/screening.service';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {withRequestStatus} from '@cinemabooking/stores/features/request-status.store';
import {HttpErrorResponse} from '@angular/common/http';

interface ScreeningState {
  screenings: Screening[];
  selectedDate: string;
}

const initialState: ScreeningState = {
  screenings: [],
  selectedDate: getLocalDateString(new Date()),
};

export const screeningStore = signalStore(
  {providedIn: 'root'},
  withRequestStatus(),
  withState(initialState),
  withComputed(({screenings, selectedDate}) => ({
    visibleScreenings: computed(() => {
      const date = selectedDate();
      if (!date) return [];

      return screenings()
        .filter((s) => s.startTime.startsWith(date))
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    }),

    calendarDays: computed(() => generateDays(5))
  })),
  withMethods((store, screeningService = inject(ScreeningService)) => ({

    selectDate(date: string): void {
      patchState(store, {selectedDate: date});
    },

    loadScreeningsByMovieId: rxMethod<number>(
      pipe(
        tap((): void => {
          patchState(store, {screenings: []});
          store.setLoading();
        }),
        switchMap((movieId: number) => {
          return screeningService.getScreeningsByMovieId(movieId).pipe(
            tapResponse({
              next: (screenings: Screening[]): void => {
                patchState(store, {screenings});
                store.setLoaded();
              },
              error: (err: HttpErrorResponse | Error): void => store.setError(err),
            })
          );
        })
      )
    ),
  }))
);

function getLocalDateString(date: Date): string {
  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset).toISOString().split('T')[0];
}

function generateDays(count: number): { label: string; date: string }[] {
  const dates = [];
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    const label = i === 0 ? 'Dzisiaj' : date.toLocaleDateString('pl-PL', {day: 'numeric', month: 'numeric'});
    const dateString = getLocalDateString(date);

    dates.push({label, date: dateString});
  }
  
  return dates;
}
