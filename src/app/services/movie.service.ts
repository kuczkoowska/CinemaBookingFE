import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Movie} from '@cinemabooking/interfaces/movie';
import {Screening} from '@cinemabooking/interfaces/screening';


const getDate = (offsetDays: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);

  return date.toISOString().split('T')[0];
};

@Injectable({
  providedIn: 'root',
})
export class MovieService {

  private today = getDate(0);
  private tomorrow = getDate(1);

  private mockScreenings: Screening[] = [
    {
      id: 101,
      movieId: 1,
      movieTitle: 'Diuna',
      startTime: `${this.today}T14:30:00`,
      theaterRoomId: 1,
      theaterRoomName: 'Sala 1'
    },
    {
      id: 102,
      movieId: 1,
      movieTitle: 'Diuna',
      startTime: `${this.today}T18:00:00`,
      theaterRoomId: 2,
      theaterRoomName: 'Sala IMAX'
    },

    {
      id: 103,
      movieId: 1,
      movieTitle: 'Diuna',
      startTime: `${this.tomorrow}T16:00:00`,
      theaterRoomId: 1,
      theaterRoomName: 'Sala 2'
    },

    {
      id: 201,
      movieId: 2,
      movieTitle: 'Panda',
      startTime: `${this.today}T10:00:00`,
      theaterRoomId: 3,
      theaterRoomName: 'Sala 3'
    },
  ];

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
      trailerUrl: 'http://localhost:3000/todos'
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

  public getMovieById(id: number): Observable<Movie | undefined> {
    const movie = this.mockMovies.find((m) => m.id === id);

    return of(movie);
  }

  public getScreenings(movieId: number): Observable<Screening[]> {
    const screenings = this.mockScreenings.filter((s) => s.movieId === movieId);

    return of(screenings);
  }
}
