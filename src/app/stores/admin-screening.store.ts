import {computed, inject} from '@angular/core';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {ScreeningService} from '@cinemabooking/services/screening.service';
import {NotificationService} from '@cinemabooking/services/notification.service';
import {CreateScreeningDto} from '@cinemabooking/interfaces/dto/create-screening-dto';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {withRequestStatus} from '@cinemabooking/stores/features/request-status.store';
import {HttpErrorResponse} from '@angular/common/http';
import {Screening} from '@cinemabooking/interfaces/models/screening';

interface AdminScreeningsState {
  screenings: Screening[];
  selectedDate: Date;
  isDialogOpen: boolean;
}

const initialState: AdminScreeningsState = {
  screenings: [],
  selectedDate: new Date(),
  isDialogOpen: false,
};

export const adminScreeningsStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withRequestStatus(),

  withComputed(({selectedDate}) => ({
    formattedDate: computed(() => {
      const date = selectedDate();
      const offset = date.getTimezoneOffset() * 60000;
      const localDate = new Date(date.getTime() - offset);

      return localDate.toISOString().split('T')[0];
    })
  })),

  withMethods((store) => ({
    setDate(date: Date): void {
      patchState(store, {selectedDate: date});
    },
    openDialog(): void {
      patchState(store, {isDialogOpen: true});
    },
    closeDialog(): void {
      patchState(store, {isDialogOpen: false});
    },
  })),

  withMethods((store, screeningService = inject(ScreeningService), notify = inject(NotificationService)) => ({
    loadScreenings: rxMethod<void>(
      pipe(
        tap(() => store.setLoading()),
        switchMap(() => {
          const dateStr = store.formattedDate();

          return screeningService.getScreenings(dateStr).pipe(
            tapResponse({
              next: (screenings) => {
                patchState(store, {screenings});
                store.setLoaded();
              },
              error: (err: HttpErrorResponse) => {
                store.setError(err);
                notify.showError('Błąd', 'Nie udało się pobrać seansów');
              }
            })
          );
        })
      )
    ),
  })),

  withMethods((store, screeningService = inject(ScreeningService), notify = inject(NotificationService)) => ({
    createScreening: rxMethod<CreateScreeningDto>(
      pipe(
        tap(() => store.setLoading()),
        switchMap((dto) => screeningService.createScreening(dto).pipe(
          tapResponse({
            next: () => {
              notify.showSuccess('Sukces', 'Seans dodany');
              store.closeDialog();
              store.loadScreenings();
            },
            error: (err: HttpErrorResponse) => {
              store.setError(err);
              if (err.status === 409) {
                notify.showError('Konflikt', 'Sala jest zajęta w tym terminie.');
              } else {
                notify.showError('Błąd', 'Nie udało się dodać seansu.');
              }
            }
          })
        ))
      )
    )
  }))
);
