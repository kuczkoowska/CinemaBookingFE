export interface Screening {
  readonly id: number;
  readonly startTime: string;
  readonly movieId: number;
  readonly movieTitle: string;
  readonly theaterRoomId: number;
  readonly theaterRoomName: string;
}
