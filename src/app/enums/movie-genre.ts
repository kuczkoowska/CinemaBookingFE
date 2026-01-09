export enum MovieGenre {
  ACTION = 'ACTION',
  COMEDY = 'COMEDY',
  DRAMA = 'DRAMA',
  THRILLER = 'THRILLER',
  SCIFI = 'SCI_FI',
  HORROR = 'HORROR',
  ANIMATION = 'ANIMATION',
  DOCUMENTARY = 'DOCUMENTARY',
  FANTASY = 'FANTASY',
  HISTORY = 'HISTORY',
  OTHER = 'OTHER'
}

export const MOVIE_GENRE_LABELS: Record<MovieGenre, string> = {
  [MovieGenre.ACTION]: 'Akcja',
  [MovieGenre.COMEDY]: 'Komedia',
  [MovieGenre.DRAMA]: 'Dramat',
  [MovieGenre.THRILLER]: 'Thriller',
  [MovieGenre.SCIFI]: 'Sci-Fi',
  [MovieGenre.HORROR]: 'Horror',
  [MovieGenre.ANIMATION]: 'Animacja',
  [MovieGenre.DOCUMENTARY]: 'Dokumentalny',
  [MovieGenre.FANTASY]: 'Fantasy',
  [MovieGenre.HISTORY]: 'Historyczny',
  [MovieGenre.OTHER]: 'Inny'
};
