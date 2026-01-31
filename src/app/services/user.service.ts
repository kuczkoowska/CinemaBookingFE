import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '@cinemabooking/interfaces/user';
import {UpdateUserDto} from '@cinemabooking/interfaces/dto/update-user-dto';
import {environment} from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  public getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  public getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  public updateUser(id: number, dto: UpdateUserDto): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, dto);
  }

  public toggleBlockUser(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/block`, {});
  }

  public promoteToAdmin(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/promote`, {});
  }

  public updateMyData(dto: UpdateUserDto): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/me`, dto);
  }
}
