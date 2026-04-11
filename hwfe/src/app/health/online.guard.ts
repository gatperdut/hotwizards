import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { HealthService } from './services/health.service';

@Injectable({ providedIn: 'root' })
export class OnlineGuard implements CanActivate {
  private router = inject(Router);
  private healthService = inject(HealthService);

  public canActivate(): Observable<UrlTree | boolean> {
    return this.healthService.health$.pipe(
      catchError(() => of(this.router.createUrlTree(['/offline']))),
    );
  }
}
