import {MovieGenre} from '@cinemabooking/enums/movie-genre';

export interface GenreOption {
  readonly label: string;
  readonly value: MovieGenre | '';
}
