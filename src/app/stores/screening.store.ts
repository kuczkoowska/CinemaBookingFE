import {inject} from '@angular/core';
import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {Screening} from '@cinemabooking/interfaces/screening';
import {ScreeningService} from '@cinemabooking/services/screening.service';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {withRequestStatus} from '@cinemabooking/stores/features/request-status.store';
import {HttpErrorResponse} from '@angular/common/http';

interface ScreeningState {
  screenings: Screening[];
}

const initialState: ScreeningState = {
  screenings: [],
};

export const screeningStore = signalStore(
  {providedIn: 'root'},
  withRequestStatus(),
  withState(initialState),

  withMethods((store, screeningService = inject(ScreeningService)) => ({

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
