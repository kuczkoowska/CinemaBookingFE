import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TicketPrice, UpdateTicketPriceDto,} from '@cinemabooking/interfaces/ticket-price';
import {TicketType} from '@cinemabooking/enums/ticket-type';
import {environment} from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TicketPriceService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ticket-prices`;

  public getAllPrices(): Observable<TicketPrice[]> {
    return this.http.get<TicketPrice[]>(this.apiUrl);
  }

  public updatePrice(type: TicketType, dto: UpdateTicketPriceDto): Observable<TicketPrice> {
    return this.http.put<TicketPrice>(`${this.apiUrl}/${type}`, dto);
  }
}
