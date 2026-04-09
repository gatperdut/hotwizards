import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CanActivate, MaybeAsync, Router, UrlTree } from '@angular/router';
import { HealthStatusDto } from '@hw/shared';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HealthGuard implements CanActivate {
  private router = inject(Router);
  private httpClient = inject(HttpClient);

  public canActivate(): MaybeAsync<UrlTree | boolean> {
    return this.httpClient.get<HealthStatusDto>('/api/health').pipe(
      // map(() => true),
      // catchError(() => of(this.router.createUrlTree(['/offline']))),
      map(() => this.router.createUrlTree(['/offline'])),
    );
  }
}
