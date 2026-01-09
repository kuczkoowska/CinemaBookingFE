import {inject} from '@angular/core';
import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {Screening} from '@cinemabooking/interfaces/screening';
import {ScreeningService} from '@cinemabooking/services/screening.service';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {HttpErrorResponse} from '@angular/common/http';

interface ScreeningState {
  screenings: Screening[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ScreeningState = {
  screenings: [],
  isLoading: false,
  error: null,
};

export const screeningStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),

  withMethods((store, screeningService = inject(ScreeningService)) => ({

    loadScreeningsByMovieId: rxMethod<number>(
      pipe(
        tap(() => patchState(store, {isLoading: true, error: null, screenings: []})),
        switchMap((movieId) => {
          return screeningService.getScreeningsByMovieId(movieId).pipe(
            tapResponse({
              next: (screenings: Screening[]) => patchState(store, {screenings, isLoading: false}),
              error: (err: HttpErrorResponse) => {
                const apiError = err.error as { message: string } | null;
                const errorMsg = apiError?.message || err.message;
                patchState(store, {error: errorMsg, isLoading: false});
              },
            })
          );
        })
      )
    ),
  }))
);
