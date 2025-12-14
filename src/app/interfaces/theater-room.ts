import {Seat} from '@cinemabooking/interfaces/seat';

export interface TheaterRoom {
  readonly id: number;
  readonly name: string;
  readonly totalRows: number;
  readonly seatsPerRow: number;
  readonly seats: Seat[];
}
