import {TicketType} from '@cinemabooking/enums/ticket-type';

export interface TicketPrice {
  readonly id: number;
  readonly type: TicketType;
  readonly price: number;
}

export interface UpdateTicketPriceDto {
  readonly price: number;
}
