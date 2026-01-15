export interface TicketDto {
  readonly id: number;
  readonly seatId: number;
  readonly row: number;
  readonly seatNumber: number;
  readonly type: string;
  readonly price: number;
}

export interface UpdateTicketTypeDto {
  readonly ticketId: number;
  readonly newType: string;
}
