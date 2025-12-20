import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Movie} from '@cinemabooking/interfaces/movie';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private mockMovies: Movie[] = [
    {
      id: 1,
      title: 'Diuna: Część druga',
      genre: 'SCIFI',
      durationMinutes: 166,
      director: 'Denis Villeneuve',
      description: 'Książę Paul Atryda przyjmuje przydomek Muad\'dib i rozpoczyna duchowo-fizyczną podróż.',
      ageRating: 13,
      posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
      trailerUrl: ''
    },
    {
      id: 2,
      title: 'Kung Fu Panda 4',
      genre: 'ANIMATION',
      durationMinutes: 94,
      director: 'Mike Mitchell',
      description: 'Po, Smoczy Wojownik, zostaje wezwany przez przeznaczenie...',
      ageRating: 0,
      posterUrl: 'https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',
      trailerUrl: ''
    },
    {
      id: 3,
      title: 'Godzilla i Kong',
      genre: 'ACTION',
      durationMinutes: 115,
      director: 'Adam Wingard',
      description: 'Walka gigantów trwa.',
      ageRating: 13,
      posterUrl: 'https://image.tmdb.org/t/p/w500/tMefBSflR6PGQLv7WvFPpKLZkyk.jpg',
      trailerUrl: ''
    }
  ];

  public getMovies(): Observable<Movie[]> {
    return of(this.mockMovies);
  }
}
