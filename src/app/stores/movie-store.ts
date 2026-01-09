import {computed, inject} from '@angular/core';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {MovieService} from '@cinemabooking/services/movie.service';
import {Movie} from '@cinemabooking/interfaces/movie';
import {MovieFilters} from '@cinemabooking/interfaces/movie-filters';
import {HttpErrorResponse} from '@angular/common/http';

interface MovieState {
  movies: Movie[];
  filters: MovieFilters;
  isLoading: boolean;
  error: string | null;
}

const initialState: MovieState = {
  movies: [],
  filters: {searchQuery: '', genre: '', hideAdult: false},
  isLoading: false,
  error: null,
};

export const movieStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),

  withComputed(({movies, filters}) => ({
    filteredMovies: computed(() => {
      const currentFilters = filters();

      return movies().filter((movie) => {
        const matchesTitle = movie.title.toLowerCase().includes((currentFilters.searchQuery || '').toLowerCase());
        const matchesGenre = currentFilters.genre ? movie.genre === currentFilters.genre : true;
        const matchesAge = currentFilters.hideAdult ? movie.ageRating < 16 : true;

        return matchesTitle && matchesGenre && matchesAge;
      });
    }),
  })),

  withMethods((store, movieService = inject(MovieService)) => ({

    updateFilters(newFilters: Partial<MovieFilters>): void {
      patchState(store, (state) => ({
        filters: {...state.filters, ...newFilters}
      }));
    },

    loadMovies: rxMethod<void>(
      pipe(
        tap(() => patchState(store, {isLoading: true, error: null})),
        switchMap(() => {
          return movieService.getMovies().pipe(
            tapResponse({
              next: (movies: Movie[]) => patchState(store, {movies, isLoading: false}),
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
