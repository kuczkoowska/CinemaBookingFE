import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment.development';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';
import {User} from '@cinemabooking/interfaces/user';

interface LoginResponse {
  message: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl = `${environment.loginUrl}/login`;
  private logoutUrl = `${environment.loginUrl}/logout`;
  private currentUserUrl = `${environment.apiUrl}/users/me`;

  constructor(private http: HttpClient) {
  }

  login(username: string, password: string): Observable<LoginResponse> {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);

    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
      withCredentials: true,
      observe: 'response' as const,
    };

    return this.http.post(this.loginUrl, body.toString(), options).pipe(
      map((response) => {
        if (response.status === 200 && response.body) {
          return response.body as LoginResponse;
        }
        throw new Error('Nieprawidłowa odpowiedź serwera');
      }),
      catchError((error) => {
        if (error.status === 401 || error.status === 403 ||
          error.status === 302 || error.status === 301) {
          throw {status: 401, error: {error: 'Błędny login lub hasło'}};
        }
        throw error;
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(this.logoutUrl, {}, {withCredentials: true});
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(this.currentUserUrl, {withCredentials: true});
  }
}
