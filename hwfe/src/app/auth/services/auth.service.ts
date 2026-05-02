import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HwAuthLoginDto, HwAuthResponse, HwUser, type HwAuthRegisterDto } from '@hw/shared';
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

  public user = signal<HwUser | undefined>(undefined);

  public userId = computed(() => this.user()?.id);

  public register(userRegisterDto: HwAuthRegisterDto): Observable<HwAuthResponse> {
    return this.httpClient.post<HwAuthResponse>('/api/auth/register', userRegisterDto).pipe(
      catchError((): Observable<never> => {
        this.toastService.show({ message: 'Something went wrong during registration' });

        return EMPTY;
      }),
      tap((authResponse): void => {
        this.user.set(authResponse.user);
        this.authTokenService.set(authResponse.token);
        this.toastService.show({ message: `Welcome, ${authResponse.user.handle}!` });
      }),
    );
  }

  public login(userLoginDto: HwAuthLoginDto): Observable<HwAuthResponse> {
    return this.httpClient.post<HwAuthResponse>(`/api/auth/login`, userLoginDto).pipe(
      catchError((): Observable<never> => {
        this.toastService.show({ message: 'Incorrect credentials', color: 'warning' });

        return EMPTY;
      }),
      tap({
        next: (authResponse): void => {
          this.user.set(authResponse.user);
          this.authTokenService.set(authResponse.token);
          this.toastService.show({ message: `Welcome back, ${authResponse.user.handle}!` });
        },
      }),
    );
  }

  private verifyToken(token: string): Observable<boolean> {
    return this.httpClient.post<boolean>(`/api/auth/verify-token`, {
      token: token,
    });
  }

  public loginAuto(): Observable<HwUser | null> {
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

    this.user.set(undefined);

    void this.router.navigate(['auth', 'login']);
  }
}
