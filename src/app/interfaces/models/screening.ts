export interface Screening {
  readonly id: number;
  readonly startTime: string;
  readonly movieId: number;
  readonly movieTitle: string;
  readonly moviePosterUrl: string;
  readonly movieDescription: string;
  readonly movieDurationMinutes: number;
  readonly movieGenre: string;
  readonly movieAgeRating: number;
  readonly theaterRoomId: number;
  readonly theaterRoomName: string;
  readonly availableSeats: number;
  readonly totalSeats: number;
}
