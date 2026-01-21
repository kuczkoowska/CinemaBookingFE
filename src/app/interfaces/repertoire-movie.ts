import {MovieGenre} from '@cinemabooking/enums/movie-genre';

export interface RepertoireMovie {
  id: number,
  title: 'string',

  posterUrl: 'string',
  description: 'string',
  duration: number,
  genre: MovieGenre,
  ageRestriction: number
}
