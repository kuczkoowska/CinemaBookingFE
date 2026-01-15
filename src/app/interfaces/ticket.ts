import {TicketType} from '@cinemabooking/enums/ticket-type';

export interface Ticket {
  readonly seatId: number;
  readonly ticketType: TicketType;
}

export interface TicketPrice {
  readonly id?: number;
  readonly ticketType: string;
  readonly price: number;
}
