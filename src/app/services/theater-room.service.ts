import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateRoomDto } from '@cinemabooking/interfaces/dto/create-room-dto';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TheaterRoomService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin/rooms`;

  public createRoom(dto: CreateRoomDto): Observable<number> {
    return this.http.post<number>(this.apiUrl, dto);
  }

  public deleteRoom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
