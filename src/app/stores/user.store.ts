import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {inject} from '@angular/core';
import {UserService} from '@cinemabooking/services/user.service';
import {User} from '@cinemabooking/interfaces/user';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {NotificationService} from '@cinemabooking/services/notification.service';
import {AuthStore} from './auth.store';

interface UserState {
  users: User[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  isLoading: false,
  error: null,
};

export const UserStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),

  withMethods((store, userService = inject(UserService), notification = inject(NotificationService), authStore = inject(AuthStore)) => ({

    loadAllUsers: rxMethod<void>(
      pipe(
        tap(() => patchState(store, {isLoading: true, error: null})),
        switchMap(() => userService.getAllUsers().pipe(
          tapResponse({
            next: (users) => {
              patchState(store, {users, isLoading: false});
            },
            error: () => {
              patchState(store, {isLoading: false, error: 'Błąd pobierania użytkowników'});
            }
          })
        ))
      )
    ),

    toggleBlockUser: rxMethod<number>(
      pipe(
        switchMap((id) => userService.toggleBlockUser(id).pipe(
          tapResponse({
            next: () => {
              patchState(store, (state) => ({
                users: state.users.map(u => u.id === id ? {...u, isActive: !u.isActive} : u)
              }));
              notification.showSuccess('Sukces', 'Zmieniono status blokady');
            },
            error: () => notification.showError('Błąd', 'Nie udało się zmienić statusu')
          })
        ))
      )
    ),

    promoteToAdmin: rxMethod<number>(
      pipe(
        switchMap((id) => userService.promoteToAdmin(id).pipe(
          tapResponse({
            next: () => {
              notification.showSuccess('Sukces', 'Użytkownik awansowany na Admina');
            },
            error: () => notification.showError('Błąd', 'Nie udało się awansować')
          })
        ))
      )
    ),

    updateMyProfile: rxMethod<{ data: any, onSuccess?: () => void }>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap(({data, onSuccess}) => userService.updateMyData(data).pipe(
          tapResponse({
            next: () => {
              patchState(store, {isLoading: false});
              notification.showSuccess('Sukces', 'Twój profil został zaktualizowany');

              authStore.checkAuth();

              if (onSuccess) onSuccess();
            },
            error: () => {
              patchState(store, {isLoading: false});
              notification.showError('Błąd', 'Nie udało się zaktualizować profilu');
            }
          })
        ))
      )
    )

  }))
);
