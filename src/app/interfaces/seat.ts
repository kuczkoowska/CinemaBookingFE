export interface Seat {
  readonly id: number;
  readonly rowNumber: number;
  readonly seatNumber: number;
}

export interface SeatWithStatus extends Seat {
  readonly isReserved: boolean;
  readonly isSelected: boolean;
}
