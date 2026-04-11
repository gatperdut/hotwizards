import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class UnuthenticatedGuard implements CanActivate {
  private router = inject(Router);
  private authService = inject(AuthService);

  public canActivate(): Observable<UrlTree | boolean> {
    return this.authService.loginAuto().pipe(
      switchMap((user) => {
        return of(user ? this.router.createUrlTree(['/board']) : true);
      }),
    );
  }
}
