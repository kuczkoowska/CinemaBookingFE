import {Movie} from '@cinemabooking/interfaces/movie';

export type CreateMovieRequest = Omit<Movie, 'id'>;
