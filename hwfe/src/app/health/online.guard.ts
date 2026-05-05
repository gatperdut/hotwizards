import { inject, Injectable } from '@angular/core';
import { CanActivate, GuardResult, MaybeAsync, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { HealthService } from './services/health.service';

@Injectable({ providedIn: 'root' })
export class OnlineGuard implements CanActivate {
  private router = inject(Router);
  private healthService = inject(HealthService);

  public canActivate(): MaybeAsync<GuardResult> {
    return this.healthService.health$.pipe(
      catchError(() => of(this.router.createUrlTree(['/offline']))),
    );
  }
}
