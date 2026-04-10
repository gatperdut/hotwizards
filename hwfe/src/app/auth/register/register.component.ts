import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { email, form, FormField, required } from '@angular/forms/signals';
import { AuthRegisterDto } from '@hw/shared';
import { map, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormField, AsyncPipe, JsonPipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private authService = inject(AuthService);

  private registerModel = signal<AuthRegisterDto>({
    handle: '',
    email: '',
    password: '',
  });

  public registerForm = form(this.registerModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Invalid email' });
    required(schemaPath.password, { message: 'Password is required' });
  });

  public emailError$ = toObservable(this.registerForm.email().errors).pipe(
    map((errors) => errors.at(0)),
  );

  public register(): void {
    this.authService
      .register(this.registerModel())
      .pipe(
        tap((): void => {
          console.log('Registered?');
        }),
      )
      .subscribe();
  }
}
