import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment.development';
import {Observable} from 'rxjs';
import {Screening} from '@cinemabooking/interfaces/screening';
import {Seat} from '@cinemabooking/interfaces/seat';

@Injectable({
  providedIn: 'root',
})
export class ScreeningService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/screenings`;

  public getScreenings(): Observable<Screening[]> {
    return this.http.get<Screening[]>(`${this.apiUrl}`);
  }

  public getScreeningsByMovieId(movieId: number): Observable<Screening[]> {
    return this.http.get<Screening[]>(`${this.apiUrl}/movie/${movieId}`);
  }

  public getScreeningById(id: number): Observable<Screening> {
    return this.http.get<Screening>(`${this.apiUrl}/${id}`);
  }

  public getSeatsByScreeningId(screeningId: number): Observable<Seat[]> {
    return this.http.get<Seat[]>(`${this.apiUrl}/${screeningId}/seats`);
  }

  public createScreening(screening: Screening): Observable<Screening> {
    return this.http.post<Screening>(`${this.apiUrl}`, screening);
  }
}
