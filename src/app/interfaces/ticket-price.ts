import { TicketType } from '@cinemabooking/enums/ticket-type';

export interface TicketPrice {
  readonly id: number;
  readonly ticketType: TicketType;
  readonly price: number;
}

export interface UpdateTicketPriceDto {
  readonly price: number;
}
