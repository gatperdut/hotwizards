import { AsyncPipe, JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ResourceRef,
  Signal,
  signal,
} from '@angular/core';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { email, form, FormField, minLength, required, validateAsync } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { AuthRegisterDto } from '@hw/shared';
import { debounceTime, from, map, of, switchMap } from 'rxjs';
import { UsersApiService } from '../../users/users-api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormField, AsyncPipe, JsonPipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private usersApiService = inject(UsersApiService);
  private authService = inject(AuthService);
  private router = inject(Router);

  private registerModel = signal<AuthRegisterDto>({
    handle: '',
    email: '',
    password: '',
  });

  public availableEmailResource(
    query: Signal<string | undefined>,
  ): ResourceRef<boolean | undefined> {
    const query$ = toObservable(query).pipe(debounceTime(400));
    const debounced = toSignal(query$);

    return rxResource<boolean, string | undefined>({
      params: () => debounced(),
      stream: (request) =>
        request.params
          ? this.usersApiService.availabilityEmail({ email: request.params })
          : of(true),
    });
  }

  public availableHandleResource(
    query: Signal<string | undefined>,
  ): ResourceRef<boolean | undefined> {
    const query$ = toObservable(query).pipe(debounceTime(400));
    const debounced = toSignal(query$);

    return rxResource<boolean, string | undefined>({
      params: () => debounced(),
      stream: (request) =>
        request.params
          ? this.usersApiService.availabilityHandle({ handle: request.params })
          : of(true),
    });
  }

  public registerForm = form(this.registerModel, (schemaPath) => {
    required(schemaPath.handle, { message: 'Handle is required' });
    validateAsync(schemaPath.handle, {
      params: ({ value }) => value(),
      factory: (query) => this.availableHandleResource(query),
      onSuccess: (available: boolean) => {
        return available ? null : { kind: 'taken', message: 'Handle is already taken' };
      },
      onError: () => ({ kind: 'network', message: 'Network failed' }),
    });

    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Invalid email' });
    validateAsync(schemaPath.email, {
      params: ({ value }) => value(),
      factory: (query) => this.availableEmailResource(query),
      onSuccess: (available: boolean) => {
        return available ? null : { kind: 'taken', message: 'Email is already taken' };
      },
      onError: () => ({ kind: 'network', message: 'Network failed' }),
    });

    required(schemaPath.password, { message: 'Password is required' });
    minLength(schemaPath.password, 8, { message: 'Minimum length 8 characters' });
  });

  public emailError$ = toObservable(this.registerForm.email().errors).pipe(
    map((errors) => errors.at(0)),
  );

  public register(): void {
    this.authService
      .register(this.registerModel())
      .pipe(switchMap(() => from(this.router.navigate(['/board']))))
      .subscribe();
  }
}
