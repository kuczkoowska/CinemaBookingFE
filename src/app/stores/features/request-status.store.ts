import {patchState, signalStoreFeature, withMethods, withState} from '@ngrx/signals';
import {HttpErrorResponse} from '@angular/common/http';
import {inject} from '@angular/core';
import {NotificationService} from '@cinemabooking/services/notification.service';

interface RequestStatusState {
  isLoading: boolean;
  error: string | null;
}

const initialState: RequestStatusState = {
  isLoading: false,
  error: null,
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function withRequestStatus() {
  return signalStoreFeature(
    withState<RequestStatusState>(initialState),

    withMethods((store) => {
      const notificationService = inject(NotificationService);

      return {
        setLoading(): void {
          patchState(store, {isLoading: true, error: null});
        },

        setLoaded(): void {
          patchState(store, {isLoading: false});
        },

        setError(err: HttpErrorResponse | Error): void {
          let errorMsg: string = 'Wystąpił nieznany błąd';

          if (err instanceof HttpErrorResponse) {
            const apiError = err.error as { message: string } | null;
            errorMsg = apiError?.message || err.message;
          } else {
            errorMsg = err.message;
          }

          notificationService.showError('Błąd', errorMsg);
          patchState(store, {error: errorMsg, isLoading: false});
        },
      };
    }),
  );
}
