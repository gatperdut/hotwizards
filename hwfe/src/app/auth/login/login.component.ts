import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { email, form, FormField, minLength, required, validateAsync } from '@angular/forms/signals';
import { LoginDto } from '@hw/shared';
import { map } from 'rxjs';
import { UsersApiService } from '../../users/users-api.service';

@Component({
  selector: 'app-login',
  imports: [FormField, AsyncPipe, JsonPipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private usersApiService = inject(UsersApiService);

  private loginModel = signal<LoginDto>({
    email: '',
    password: '',
  });

  public loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Invalid email' });
    validateAsync(schemaPath.email, {
      params: ({ value }) => value(),
      factory: this.usersApiService.availableEmailResource,
      onSuccess: (available: boolean) => {
        return available ? null : { kind: 'taken', message: 'Email is already taken' };
      },
      onError: () => ({ kind: 'networkError', message: 'Network failed' }),
    });

    required(schemaPath.password, { message: 'Password is required' });
    minLength(schemaPath.password, 8, { message: 'Minimum length 8 characters' });
  });

  public emailError$ = toObservable(this.loginForm.email().errors).pipe(
    map((errors) => errors.at(0)),
  );

  public create(): void {
    console.log(this.loginForm().value());
  }
}
