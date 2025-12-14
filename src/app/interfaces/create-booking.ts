import {Ticket} from '@cinemabooking/interfaces/ticket';

export interface CreateBooking {
  readonly screeningId: number;
  readonly tickets: Ticket[];
  readonly userId: number; // do usunięcia pozniej
}
