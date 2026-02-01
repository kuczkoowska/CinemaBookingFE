export interface CreateMovieDto {
  readonly title: string;
  readonly genre: string;
  readonly description: string;
  readonly durationMinutes: number;
  readonly director: string;
  readonly ageRating: number;
  readonly posterUrl: string;
  readonly trailerUrl?: string;
}
