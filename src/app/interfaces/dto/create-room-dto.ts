export interface CreateRoomDto {
  readonly name: string;
  readonly rows: number;
  readonly seatsPerRow: number;
}
