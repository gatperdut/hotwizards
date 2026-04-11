import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { email, form, FormField, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthLoginDto } from '@hw/shared';
import { from, map, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormField, AsyncPipe, JsonPipe, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  private loginModel = signal<AuthLoginDto>({
    email: '',
    password: '',
  });

  public loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Invalid email' });

    required(schemaPath.password, { message: 'Password is required' });
  });

  public emailError$ = toObservable(this.loginForm.email().errors).pipe(
    map((errors) => errors.at(0)),
  );

  public login(): void {
    this.authService
      .login(this.loginForm().value())
      .pipe(switchMap(() => from(this.router.navigate(['/board']))))
      .subscribe();
  }
}
