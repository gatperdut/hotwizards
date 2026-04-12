import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { User } from '@hw/prismagen/browser';
import { AuthLoginDto, AuthToken, type AuthRegisterDto } from '@hw/shared';
import { catchError, EMPTY, Observable, of, switchMap, tap } from 'rxjs';
import { ToastService } from '../../ui/toast/services/toast.service';
import { UsersApiService } from '../../users/users-api.service';
import { AuthTokenService } from './auth-token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private httpClient = inject(HttpClient);
  private toastService = inject(ToastService);
  private authTokenService = inject(AuthTokenService);
  private userApiService = inject(UsersApiService);

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
        this.toastService.show({ message: 'Incorrect credentials' });

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
      return of(null);
    }

    return this.verifyToken(token).pipe(
      switchMap(() => {
        return this.userApiService.me();
      }),
      tap({
        next: (user): void => {
          this.user.set(user);

          this.toastService.show({ message: `Welcome back, ${user.handle}!` });
        },
        error: (): void => {
          this.authTokenService.clear();

          this.toastService.show({ message: 'Credentials expired, login again.' });
        },
      }),
    );
  }

  public logout(): void {
    this.toastService.show({ message: `Farewell, ${this.user()?.handle}!` });

    this.authTokenService.clear();

    this.user.set(null);
  }
}
