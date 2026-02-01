export interface Seat {
  readonly id: number;
  readonly rowNumber: number;
  readonly seatNumber: number;
  readonly available: boolean;
}

export interface SeatWithStatus extends Seat {
  readonly isSelected: boolean;
}

export interface LockSeatsDto {
  readonly screeningId: number;
  readonly seatIds: number[];
}
