import {Pipe, PipeTransform} from '@angular/core';
import {MOVIE_GENRE_LABELS, MovieGenre} from '@cinemabooking/enums/movie-genre';

@Pipe({
  name: 'genreName',
})
export class GenreNamePipe implements PipeTransform {

  public transform(value: string | MovieGenre): string {
    const label = MOVIE_GENRE_LABELS[value as MovieGenre];

    return label || value;
  }
}
