import {Movie} from '@cinemabooking/interfaces/movie';
import {Screening} from '@cinemabooking/interfaces/screening';

export interface RepertoireItem {
  readonly movie: Movie;
  readonly screenings: Screening[];
}
