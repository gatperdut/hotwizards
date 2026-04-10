import { inject, Injectable } from '@angular/core';
import { CanActivate, MaybeAsync, Router, UrlTree } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { HealthService } from './services/health.service';

@Injectable({ providedIn: 'root' })
export class OfflineGuard implements CanActivate {
  private router = inject(Router);
  private healthService = inject(HealthService);

  public canActivate(): MaybeAsync<UrlTree | boolean> {
    return this.healthService.health$.pipe(
      map(() => this.router.createUrlTree(['/'])),
      catchError(() => of(true)),
    );
  }
}
