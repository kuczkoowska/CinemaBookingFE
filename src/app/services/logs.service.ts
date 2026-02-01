import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LogType, SystemLog} from '@cinemabooking/interfaces/system-log';
import {environment} from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class LogsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin/logs`;

  public getSystemLogs(type?: LogType): Observable<SystemLog[]> {
    let params = new HttpParams();
    if (type) {
      params = params.set('type', type);
    }

    return this.http.get<SystemLog[]>(this.apiUrl, {params});
  }
}
