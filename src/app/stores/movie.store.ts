import {computed, inject} from '@angular/core';
import {patchState, signalStore, withComputed, withHooks, withMethods, withState} from '@ngrx/signals';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {EMPTY, pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {MovieService} from '@cinemabooking/services/movie.service';
import {Movie} from '@cinemabooking/interfaces/movie';
import {MovieFilters} from '@cinemabooking/interfaces/filters/movie-filters';
import {withRequestStatus} from '@cinemabooking/stores/features/request-status.store';
import {HttpErrorResponse} from '@angular/common/http';

interface MovieState {
  movies: Movie[];
  selectedMovieId: number | null;
  filters: MovieFilters;
}

const initialState: MovieState = {
  movies: [],
  selectedMovieId: null,
  filters: {searchQuery: '', genre: '', hideAdult: false},
};

export const movieStore = signalStore(
  {providedIn: 'root'},
  withRequestStatus(),
  withState(initialState),

  withComputed(({movies, filters, selectedMovieId}) => ({
    filteredMovies: computed((): Movie[] => {
      const currentFilters = filters();
      const query = (currentFilters.searchQuery || '').toLowerCase();

      return movies().filter((movie: Movie): boolean => {
        const matchesTitle = movie.title.toLowerCase().includes(query);
        const matchesGenre = currentFilters.genre ? movie.genre === currentFilters.genre : true;
        const matchesAge = currentFilters.hideAdult ? movie.ageRating < 16 : true;

        return matchesTitle && matchesGenre && matchesAge;
      });
    }),

    selectedMovie: computed((): Movie | null => {
      const id = selectedMovieId();

      return movies().find((m) => m.id === id) ?? null;
    })
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
              next: (movies: Movie[]): void => {
                patchState(store, {movies});
                store.setLoaded();
              },
              error: (err: HttpErrorResponse | Error): void => store.setError(err),
            })
          );
        })
      )
    ),


    loadMovieById: rxMethod<number>(
      pipe(
        tap((id: number): void => patchState(store, {selectedMovieId: id, error: null})),
        switchMap((id: number) => {
          const existingMovie = store.movies().find((m: Movie): boolean => m.id === id);
          if (existingMovie) return EMPTY;

          patchState(store, {isLoading: true});

          return movieService.getMovieById(id).pipe(
            tapResponse({
              next: (movie: Movie): void => {
                patchState(store, {
                  movies: [...store.movies(), movie],
                });
                store.setLoaded();
              },
              error: (err: HttpErrorResponse | Error): void => store.setError(err),
            })
          );
        })
      )
    )
  })),
  withHooks({
    onInit(store: { loadMovies: () => void }): void {
      store.loadMovies();
    }
  })
);
