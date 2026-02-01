import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {inject} from '@angular/core';
import {UserService} from '@cinemabooking/services/user.service';
import {User} from '@cinemabooking/interfaces/user';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {NotificationService} from '@cinemabooking/services/notification.service';
import {AuthStore} from './auth.store';
import {Router} from '@angular/router';
import {withRequestStatus} from '@cinemabooking/stores/features/request-status.store';
import {HttpErrorResponse} from '@angular/common/http';
import {UpdateUserDto} from '@cinemabooking/interfaces/dto/update-user-dto';

interface UserState {
  users: User[];
  isDialogOpen: boolean;
  selectedUser: User | null;
}

const initialState: UserState = {
  users: [],
  isDialogOpen: false,
  selectedUser: null,
};

export const UserStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withRequestStatus(),

  withMethods((
    store,
    userService = inject(UserService),
    notify = inject(NotificationService),
    authStore = inject(AuthStore),
    router = inject(Router)
  ) => ({

    openEditDialog(user: User): void {
      patchState(store, {selectedUser: user, isDialogOpen: true});
    },

    closeDialog(): void {
      patchState(store, {selectedUser: null, isDialogOpen: false});
    },

    loadUsers: rxMethod<void>(
      pipe(
        tap(() => store.setLoading()),
        switchMap(() => userService.getAllUsers().pipe(
          tapResponse({
            next: (users) => {
              patchState(store, {users});
              store.setLoaded();
            },
            error: (err: Error | HttpErrorResponse) => {
              store.setError(err);
              notify.showError('Błąd', 'Nie udało się pobrać użytkowników');
            }
          })
        ))
      )
    ),

    updateUser: rxMethod<{ id: number; data: UpdateUserDto }>(
      pipe(
        tap(() => store.setLoading()),
        switchMap(({id, data}) => userService.updateUser(id, data).pipe(
          tapResponse({
            next: () => {
              notify.showSuccess('Sukces', 'Zaktualizowano użytkownika');
              patchState(store, {isDialogOpen: false, selectedUser: null});
              store.setLoaded();

            },
            error: (err: Error | HttpErrorResponse) => {
              store.setError(err);
              notify.showError('Błąd', 'Aktualizacja nieudana');
            }
          })
        ))
      )
    ),

    toggleBlockUser: rxMethod<User>(
      pipe(
        switchMap((user) => userService.toggleBlockUser(user.id).pipe(
          tapResponse({
            next: () => {
              const action = user.isActive ? 'Zablokowano' : 'Odblokowano';

              patchState(store, (state) => ({
                users: state.users.map(u => u.id === user.id ? {...u, isActive: !u.isActive} : u)
              }));

              notify.showSuccess('Sukces', `${action} użytkownika`);
            },
            error: () => notify.showError('Błąd', 'Zmiana statusu nieudana')
          })
        ))
      )
    ),

    promoteToAdmin: rxMethod<number>(
      pipe(
        switchMap((id) => userService.promoteToAdmin(id).pipe(
          tapResponse({
            next: () => {
              notify.showSuccess('Sukces', 'Użytkownik awansowany na Admina');
            },
            error: () => notify.showError('Błąd', 'Nie udało się awansować')
          })
        ))
      )
    ),

    updateMyProfile: rxMethod<any>(
      pipe(
        tap(() => store.setLoading()),
        switchMap((data) => userService.updateMyData(data).pipe(
          tapResponse({
            next: () => {
              store.setLoaded();
              notify.showSuccess('Sukces', 'Profil zaktualizowany');
              authStore.checkAuth();
              router.navigate(['/profile']);
            },

            error: (err: Error | HttpErrorResponse) => {
              store.setError(err);
              notify.showError('Błąd', 'Nie udało się zapisać');
            }
          })
        ))
      )
    ),

  }))
);
