import {Movie} from '@cinemabooking/interfaces/models/movie';
import {Screening} from '@cinemabooking/interfaces/models/screening';

export interface RepertoireItem {
  readonly movie: Movie;
  readonly screenings: Screening[];
}
