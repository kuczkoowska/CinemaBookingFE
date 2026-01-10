import {inject, Injectable} from '@angular/core';
import {forkJoin, map, Observable, switchMap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment.development';
import {LockSeatsDto, SeatWithStatus} from '@cinemabooking/interfaces/seat';
import {Ticket} from '@cinemabooking/interfaces/ticket';
import {BookingDto} from '@cinemabooking/interfaces/booking-dto';
import {ScreeningService} from '@cinemabooking/services/screening.service';
import {MovieService} from '@cinemabooking/services/movie.service';
import {Booking} from '@cinemabooking/interfaces/booking';


@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/bookings`;

  private screeningService = inject(ScreeningService);
  private movieService = inject(MovieService);

  public lockSeats(dto: LockSeatsDto): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/lock`, dto);
  }

  public updateTicketTypes(bookingId: number, tickets: Ticket[]): Observable<BookingDto> {
    return this.http.put<BookingDto>(`${this.apiUrl}/${bookingId}/tickets`, tickets);
  }

  public confirmBooking(bookingId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${bookingId}/pay`, {});
  }

  public cancelBooking(bookingId: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${bookingId}/cancel`, {});
  }

  public getBookingById(bookingId: number): Observable<BookingDto> {
    return this.http.get<BookingDto>(`${this.apiUrl}/${bookingId}`);
  }

  public getBookingData(screeningId: number): Observable<Booking> {
    return this.screeningService.getScreeningById(screeningId).pipe(
      switchMap((screening) => {

        return forkJoin({
          movie: this.movieService.getMovieById(screening.movieId),
          seats: this.screeningService.getSeatsByScreeningId(screeningId)
        }).pipe(
          map((result) => {
            const mappedSeats: SeatWithStatus[] = result.seats.map((seat) => ({
              ...seat,
              isSelected: false
            }));

            return {
              movie: result.movie,
              screening: screening,
              seats: mappedSeats
            };
          })
        );
      })
    );
  }
}
