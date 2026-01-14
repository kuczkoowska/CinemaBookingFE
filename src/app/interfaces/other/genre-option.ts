import {MovieGenre} from '@cinemabooking/enums/movie-genre';

export interface GenreOption {
  label: string;
  value: MovieGenre | '';
}
