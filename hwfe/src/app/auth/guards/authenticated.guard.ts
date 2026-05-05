import { inject, Injectable } from '@angular/core';
import { CanActivate, GuardResult, MaybeAsync, Router } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthenticatedGuard implements CanActivate {
  private router = inject(Router);
  private authService = inject(AuthService);

  public canActivate(): MaybeAsync<GuardResult> {
    return this.authService.loginAuto().pipe(
      switchMap(() => of(true)),
      catchError(() => of(this.router.createUrlTree(['/auth/login']))),
    );
  }
}
