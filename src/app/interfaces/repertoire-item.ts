import {Movie} from '@cinemabooking/interfaces/movie';
import {Screening} from '@cinemabooking/interfaces/screening';

export interface RepertoireItem {
  movie: Movie;
  screenings: Screening[];
}
