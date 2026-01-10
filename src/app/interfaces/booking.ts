import {Movie} from '@cinemabooking/interfaces/movie';
import {Screening} from '@cinemabooking/interfaces/screening';
import {SeatWithStatus} from '@cinemabooking/interfaces/seat';

export interface Booking {
  readonly movie: Movie,
  readonly screening: Screening,
  readonly seats: SeatWithStatus[];
}
