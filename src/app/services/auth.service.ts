import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment.development';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
import {User} from '@cinemabooking/interfaces/user';

interface LoginResponse {
  message: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private loginUrl = `${environment.loginUrl}/login`;
  private logoutUrl = `${environment.loginUrl}/logout`;
  private currentUserUrl = `${environment.apiUrl}/users/me`;

  public login(username: string, password: string): Observable<LoginResponse> {
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
      catchError((error: HttpErrorResponse) => {
        if ([401, 403, 302, 301].includes(error.status)) {
          return throwError(() => new Error('Błędny login lub hasło'));
        }
        
        return throwError(() => error);
      })
    );
  }

  public logout(): Observable<unknown> {
    return this.http.post(this.logoutUrl, {}, {withCredentials: true});
  }

  public getCurrentUser(): Observable<User> {
    return this.http.get<User>(this.currentUserUrl, {withCredentials: true});
  }
}
