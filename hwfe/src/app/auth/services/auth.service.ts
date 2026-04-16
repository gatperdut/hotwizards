import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@hw/prismagen/browser';
import { AuthLoginDto, AuthToken, type AuthRegisterDto } from '@hw/shared';
import { catchError, EMPTY, Observable, switchMap, tap, throwError } from 'rxjs';
import { ToastService } from '../../ui/toast/services/toast.service';
import { UsersApiService } from '../../users/users-api.service';
import { AuthTokenService } from './auth-token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private httpClient = inject(HttpClient);
  private toastService = inject(ToastService);
  private authTokenService = inject(AuthTokenService);
  private userApiService = inject(UsersApiService);
  private router = inject(Router);

  public user: WritableSignal<User | null> = signal<User | null>(null);

  public register(userRegisterDto: AuthRegisterDto): Observable<User> {
    return this.httpClient.post<AuthToken>('/api/auth/register', userRegisterDto).pipe(
      catchError((): Observable<never> => {
        this.toastService.show({ message: 'Something went wrong during registration' });

        return EMPTY;
      }),
      tap({
        next: (authToken: AuthToken): void => {
          this.authTokenService.set(authToken.token);
        },
      }),
      switchMap((): Observable<User> => {
        return this.userApiService.me();
      }),
      tap({
        next: (user: User): void => {
          this.user.set(user);

          this.toastService.show({ message: `Welcome, ${user.handle}!` });
        },
      }),
    );
  }

  public login(userLoginDto: AuthLoginDto): Observable<User> {
    return this.httpClient.post<AuthToken>(`/api/auth/login`, userLoginDto).pipe(
      catchError((): Observable<never> => {
        this.toastService.show({ message: 'Incorrect credentials', color: 'warning' });

        return EMPTY;
      }),
      tap({
        next: (authToken): void => {
          this.authTokenService.set(authToken.token);
        },
      }),
      switchMap(() => {
        return this.userApiService.me();
      }),
      tap({
        next: (user: User): void => {
          this.user.set(user);

          this.toastService.show({ message: `Welcome back, ${user.handle}!` });
        },
      }),
    );
  }

  private verifyToken(token: string): Observable<boolean> {
    return this.httpClient.post<boolean>(`/api/auth/verify-token`, {
      token: token,
    });
  }

  public loginAuto(): Observable<User | null> {
    const token: string = this.authTokenService.get();

    if (!token) {
      return throwError(() => new Error('Credentials not found'));
    }

    return this.verifyToken(token).pipe(
      catchError(() => {
        this.authTokenService.clear();

        this.toastService.show({ message: 'Credentials expired, login again', color: 'warning' });

        throw new Error('Credentials expired');
      }),
      switchMap(() => {
        return this.userApiService.me();
      }),
      tap((user): void => {
        this.user.set(user);
      }),
    );
  }

  public logout(): void {
    this.toastService.show({ message: `Farewell, ${this.user()?.handle}!` });

    this.authTokenService.clear();

    this.user.set(null);

    void this.router.navigate(['/auth/login']);
  }
}
