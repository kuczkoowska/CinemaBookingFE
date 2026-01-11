import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {computed, inject} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap} from 'rxjs';
import {Router} from '@angular/router';
import {User} from '@cinemabooking/interfaces/user';
import {tapResponse} from '@ngrx/operators';
import {HttpErrorResponse} from '@angular/common/http';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const authStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),

  withComputed(({user}) => ({
    isAdmin: computed(() => {
      const currentUser = user();

      return !!currentUser && currentUser.roles.some((r) => r.name === 'ROLE_ADMIN');
    }),
    displayName: computed(() => {
      const u = user();
      if (!u) return 'Gość';

      return u.firstName || u.email;
    })
  })),

  withMethods((store, authService = inject(AuthService), router = inject(Router)) => ({
    login: rxMethod<{ username: string; password: string }>(
      pipe(
        tap(() => patchState(store, {isLoading: true, error: null})),
        switchMap(({username, password}) =>
          authService.login(username, password).pipe(
            tapResponse({
              next: (response) => {
                patchState(store, {
                  user: response.user,
                  isAuthenticated: true,
                  isLoading: false,
                  error: null
                });
                router.navigate(['/']);
              },
              error: (error: HttpErrorResponse) => {
                const errorMessage = error.status === 401 || error.status === 403
                  ? 'Błędny login lub hasło'
                  : 'Wystąpił błąd podczas logowania';

                patchState(store, {
                  error: errorMessage,
                  isLoading: false,
                  isAuthenticated: false,
                  user: null
                });
              }
            })
          )
        )
      )
    ),

    logout: rxMethod<void>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap(() =>
          authService.logout().pipe(
            tapResponse({
              next: () => {
                patchState(store, initialState);
                router.navigate(['/login']);
              },
              error: () => {
                patchState(store, initialState);
                router.navigate(['/login']);
              }
            })
          )
        )
      )
    ),

    checkAuth: rxMethod<void>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap(() =>
          authService.getCurrentUser().pipe(
            tapResponse({
              next: (user) => {
                patchState(store, {
                  user,
                  isAuthenticated: true,
                  isLoading: false,
                  error: null
                });
              },
              error: () => {
                patchState(store, {
                  user: null,
                  isAuthenticated: false,
                  isLoading: false
                });
              }
            })
          )
        )
      )
    ),

    clearError(): void {
      patchState(store, {error: null});
    }
  })),
);
