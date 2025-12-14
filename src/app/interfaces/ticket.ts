import {TicketType} from '@cinemabooking/enums/ticket-type';

export interface Ticket {
  readonly seatId: number;
  readonly ticketType: TicketType;
}
