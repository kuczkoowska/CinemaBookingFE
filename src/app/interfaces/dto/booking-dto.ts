import { TicketDto } from '@cinemabooking/interfaces/dto/ticket-dto';

export interface BookingDto {
  readonly id: number;
  readonly bookingTime: string;
  readonly status: string;
  readonly totalAmount: number;

  readonly movieTitle: string;
  readonly moviePosterUrl: string;
  readonly movieDescription: string;
  readonly movieDurationMinutes: number;
  readonly movieGenre: string;
  readonly movieAgeRating: string;

  readonly theaterRoomName: string;
  readonly screeningTime: string;

  readonly tickets: TicketDto[];
  readonly expirationTime: string;
}
