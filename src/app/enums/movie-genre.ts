export enum MovieGenre {
  AKCJA = 'AKCJA',
  KOMEDIA = 'KOMEDIA',
  DRAMAT = 'DRAMAT',
  THRILLER = 'THRILLER',
  SCI_FI = 'SCI_FI',
  HORROR = 'HORROR',
  ANIMACJA = 'ANIMACJA',
  DOKUMENTALNY = 'DOKUMENTALNY',
  FANTASY = 'FANTASY',
  HISTORYCZNY = 'HISTORYCZNY',
  INNY = 'INNY',
}

export const MOVIE_GENRE_LABELS: Record<MovieGenre, string> = {
  [MovieGenre.AKCJA]: 'Akcja',
  [MovieGenre.KOMEDIA]: 'Komedia',
  [MovieGenre.DRAMAT]: 'Dramat',
  [MovieGenre.THRILLER]: 'Thriller',
  [MovieGenre.SCI_FI]: 'Sci-Fi',
  [MovieGenre.HORROR]: 'Horror',
  [MovieGenre.ANIMACJA]: 'Animacja',
  [MovieGenre.DOKUMENTALNY]: 'Dokumentalny',
  [MovieGenre.FANTASY]: 'Fantasy',
  [MovieGenre.HISTORYCZNY]: 'Historyczny',
  [MovieGenre.INNY]: 'Inny',
};
