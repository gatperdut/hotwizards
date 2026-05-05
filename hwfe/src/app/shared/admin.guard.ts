import { inject, Injectable } from '@angular/core';
import { CanActivate, GuardResult, MaybeAsync, Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  public canActivate(): MaybeAsync<GuardResult> {
    return this.authService.user()!.admin || this.router.createUrlTree(['home', 'campaigns']);
  }
}
