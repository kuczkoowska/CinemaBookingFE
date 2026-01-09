import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Movie} from '@cinemabooking/interfaces/movie';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment.development';


@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/movies`;


  public getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/front`);
  }

  public getMovieById(id: number): Observable<Movie | undefined> {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`);
  }

  public postMovie(movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(`${this.apiUrl}`, movie);
  }

  public editMovie(movie: Movie): Observable<Movie> {
    return this.http.put<Movie>(`${this.apiUrl}/${movie.id}`, movie);
  }

  public deleteMoving(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
