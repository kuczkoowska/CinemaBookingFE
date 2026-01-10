export interface BookingDto {
  readonly id: number;
  readonly status: string;
  readonly totalPrice: number;
  readonly expirationTime: string;
}
