import {computed, inject} from '@angular/core';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {EMPTY, pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {MovieService} from '@cinemabooking/services/movie.service';
import {Movie} from '@cinemabooking/interfaces/movie';
import {MovieFilters} from '@cinemabooking/interfaces/filters/movie-filters';
import {withRequestStatus} from '@cinemabooking/stores/features/request-status.store';
import {HttpErrorResponse} from '@angular/common/http';
import {NotificationService} from '@cinemabooking/services/notification.service';

interface MovieState {
  movies: Movie[];
  selectedMovieId: number | null;
  filters: MovieFilters;
  page: number;
  pageSize: number;
}

const initialState: MovieState = {
  movies: [],
  selectedMovieId: null,
  filters: {searchQuery: '', genre: '', hideAdult: false},
  page: 1,
  pageSize: 9,
};

export const movieStore = signalStore(
  {providedIn: 'root'},
  withRequestStatus(),
  withState(initialState),

  withComputed(({movies, filters, selectedMovieId, page, pageSize}) => ({
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

    paginatedMovies: computed((): Movie[] => {
      const filtered = movies().filter((movie: Movie): boolean => {
        const currentFilters = filters();
        const query = (currentFilters.searchQuery || '').toLowerCase();
        const matchesTitle = movie.title.toLowerCase().includes(query);
        const matchesGenre = currentFilters.genre ? movie.genre === currentFilters.genre : true;
        const matchesAge = currentFilters.hideAdult ? movie.ageRating < 16 : true;

        return matchesTitle && matchesGenre && matchesAge;
      });

      const startIndex = (page() - 1) * pageSize();
      const endIndex = startIndex + pageSize();

      return filtered.slice(startIndex, endIndex);
    }),

    totalPages: computed((): number => {
      const filtered = movies().filter((movie: Movie): boolean => {
        const currentFilters = filters();
        const query = (currentFilters.searchQuery || '').toLowerCase();
        const matchesTitle = movie.title.toLowerCase().includes(query);
        const matchesGenre = currentFilters.genre ? movie.genre === currentFilters.genre : true;
        const matchesAge = currentFilters.hideAdult ? movie.ageRating < 16 : true;

        return matchesTitle && matchesGenre && matchesAge;
      });

      return Math.ceil(filtered.length / pageSize());
    }),

    totalItems: computed((): number => {
      const currentFilters = filters();
      const query = (currentFilters.searchQuery || '').toLowerCase();

      return movies().filter((movie: Movie): boolean => {
        const matchesTitle = movie.title.toLowerCase().includes(query);
        const matchesGenre = currentFilters.genre ? movie.genre === currentFilters.genre : true;
        const matchesAge = currentFilters.hideAdult ? movie.ageRating < 16 : true;

        return matchesTitle && matchesGenre && matchesAge;
      }).length;
    }),

    selectedMovie: computed((): Movie | null => {
      const id = selectedMovieId();

      return movies().find((m) => m.id === id) ?? null;
    }),
  })),

  withMethods(
    (store, movieService = inject(MovieService), notification = inject(NotificationService)) => ({
      updateFilters(newFilters: Partial<MovieFilters>): void {
        patchState(store, (state) => ({
          filters: {...state.filters, ...newFilters},
          page: 1,
        }));
      },

      setPage(page: number): void {
        patchState(store, {page});
      },

      setPageSize(pageSize: number): void {
        patchState(store, {pageSize, page: 1});
      },

      nextPage(): void {
        const currentPage = store.page();
        const maxPages = store.totalPages();
        if (currentPage < maxPages) {
          patchState(store, {page: currentPage + 1});
        }
      },

      previousPage(): void {
        const currentPage = store.page();
        if (currentPage > 1) {
          patchState(store, {page: currentPage - 1});
        }
      },

      loadMovies: rxMethod<void>(
        pipe(
          tap(() => {
            if (store.movies().length > 0) {
              return;
            }
            patchState(store, {isLoading: true, error: null});
          }),
          switchMap(() => {
            if (store.movies().length > 0) {
              return EMPTY;
            }

            return movieService.getMovies().pipe(
              tapResponse({
                next: (movies: Movie[]): void => {
                  patchState(store, {movies});
                  store.setLoaded();
                },
                error: (err: HttpErrorResponse | Error): void => store.setError(err),
              }),
            );
          }),
        ),
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
              }),
            );
          }),
        ),
      ),

      addMovie: rxMethod<{ movie: Omit<Movie, 'id'>; onSuccess?: () => void }>(
        pipe(
          tap(() => patchState(store, {isLoading: true})),
          switchMap(({movie, onSuccess}) =>
            movieService.postMovie(movie as Movie).pipe(
              tapResponse({
                next: (createdMovie) => {
                  patchState(store, (state) => ({movies: [...state.movies, createdMovie]}));
                  store.setLoaded();
                  notification.showSuccess('Sukces', 'Film dodany');
                  if (onSuccess) onSuccess();
                },
                error: (err: HttpErrorResponse | Error): void => store.setError(err),
              }),
            ),
          ),
        ),
      ),

      updateMovie: rxMethod<{ movie: Movie; onSuccess?: () => void }>(
        pipe(
          tap(() => patchState(store, {isLoading: true})),
          switchMap(({movie, onSuccess}) =>
            movieService.editMovie(movie).pipe(
              tapResponse({
                next: (updatedMovie) => {
                  patchState(store, (state) => ({
                    movies: state.movies.map((m) => (m.id === updatedMovie.id ? updatedMovie : m)),
                  }));
                  store.setLoaded();
                  notification.showSuccess('Sukces', 'Film zaktualizowany');
                  if (onSuccess) onSuccess();
                },
                error: (err: HttpErrorResponse | Error): void => store.setError(err),
              }),
            ),
          ),
        ),
      ),

      deleteMovie: rxMethod<{ id: number; onSuccess?: () => void }>(
        pipe(
          tap(() => patchState(store, {isLoading: true})),
          switchMap(({id, onSuccess}) =>
            movieService.deleteMoving(id).pipe(
              tapResponse({
                next: () => {
                  patchState(store, (state) => ({
                    movies: state.movies.filter((m) => m.id !== id),
                  }));
                  store.setLoaded();
                  notification.showSuccess('Sukces', 'Film usunięty');
                  if (onSuccess) onSuccess();
                },
                error: (err: HttpErrorResponse | Error): void => store.setError(err),
              }),
            ),
          ),
        ),
      ),
    }),
  ),
);
