import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SalesStats} from '@cinemabooking/interfaces/stats';
import {environment} from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin/stats`;

  public getDailySales(sortBy: string = 'date', dir: string = 'DESC'): Observable<SalesStats[]> {
    const params = new HttpParams().set('sortBy', sortBy).set('dir', dir);

    return this.http.get<SalesStats[]>(this.apiUrl, {params});
  }
}
