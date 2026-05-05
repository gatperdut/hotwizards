import { inject, Injectable } from '@angular/core';
import { CanActivate, GuardResult, MaybeAsync, Router } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class UnuthenticatedGuard implements CanActivate {
  private router = inject(Router);
  private authService = inject(AuthService);

  public canActivate(): MaybeAsync<GuardResult> {
    return this.authService.loginAuto().pipe(
      switchMap(() => of(this.router.createUrlTree(['/home']))),
      catchError(() => of(true)),
    );
  }
}
