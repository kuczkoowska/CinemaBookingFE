import {MOVIE_GENRE_LABELS, MovieGenre} from '@cinemabooking/enums/movie-genre';
import {GenreOption} from '@cinemabooking/interfaces/ui/genre-option';

export const GENRE_SELECT_OPTIONS: GenreOption[] = [
  {label: 'Wszystkie gatunki', value: ''},
  ...Object.values(MovieGenre).map((code) => ({
    label: MOVIE_GENRE_LABELS[code] || code,
    value: code,
  })),
];
