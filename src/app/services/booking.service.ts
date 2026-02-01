import {inject, Injectable} from '@angular/core';
import {forkJoin, map, Observable, switchMap} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment.development';
import {LockSeatsDto, SeatWithStatus} from '@cinemabooking/interfaces/seat';
import {BookingDto} from '@cinemabooking/interfaces/dto/booking-dto';
import {ScreeningService} from '@cinemabooking/services/screening.service';
import {MovieService} from '@cinemabooking/services/movie.service';
import {Booking} from '@cinemabooking/interfaces/booking';
import {UpdateTicketTypeDto} from '@cinemabooking/interfaces/dto/ticket-dto';
import {TicketPrice} from '@cinemabooking/interfaces/ticket';
import {Page} from '@cinemabooking/interfaces/page';
import {BookingContactDetails} from '@cinemabooking/interfaces/form/booking-contact.form';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/bookings`;
  private pricesUrl = `${environment.apiUrl}/ticket-prices`;

  private screeningService = inject(ScreeningService);
  private movieService = inject(MovieService);

  public getPrices(): Observable<TicketPrice[]> {
    return this.http.get<TicketPrice[]>(this.pricesUrl);
  }

  public lockSeats(dto: LockSeatsDto): Observable<BookingDto> {
    return this.http.post<BookingDto>(`${this.apiUrl}/lock`, dto);
  }

  public updateTicketTypes(bookingId: number, tickets: UpdateTicketTypeDto[]): Observable<BookingDto> {
    return this.http.put<BookingDto>(`${this.apiUrl}/${bookingId}/tickets`, tickets);
  }

  public confirmBooking(bookingId: number, contactDetails: BookingContactDetails | null): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${bookingId}/pay`, contactDetails || {});
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
          seats: this.screeningService.getSeatsByScreeningId(screeningId),
          prices: this.getPrices()
        }).pipe(
          map((result) => {

            const mappedSeats: SeatWithStatus[] = result.seats.map((seat) => ({
              ...seat,
              isSelected: false
            }));

            const priceMap: Record<string, number> = result.prices.reduce((acc, curr) => {
              acc[curr.ticketType] = curr.price;
              
              return acc;
            }, {} as Record<string, number>);

            return {
              movie: result.movie,
              screening: screening,
              seats: mappedSeats,
              prices: priceMap
            };
          })
        );
      })
    );
  }

  public getMyBookings(page: number, size: number): Observable<Page<BookingDto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<BookingDto>>(`${this.apiUrl}/my`, {params});
  }
}
