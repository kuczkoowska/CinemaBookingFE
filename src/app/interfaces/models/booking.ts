import {SeatWithStatus} from '@cinemabooking/interfaces/models/seat';
import {Screening} from '@cinemabooking/interfaces/models/screening';
import {Movie} from '@cinemabooking/interfaces/models/movie';

export interface Booking {
  readonly movie: Movie,
  readonly screening: Screening,
  readonly seats: SeatWithStatus[];
  readonly prices: Record<string, number>;
}
