import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ResourceRef,
  Signal,
  signal,
} from '@angular/core';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  email,
  form,
  FormRoot,
  maxLength,
  minLength,
  required,
  validate,
  validateAsync,
} from '@angular/forms/signals';
import { Router } from '@angular/router';
import { HwAuthRegisterDto } from '@hw/shared';
import { debounceTime, firstValueFrom, of } from 'rxjs';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputTextComponent } from '../../ui/input-text/input-text.component';
import { LinkComponent } from '../../ui/link/link.component';
import { UsersApiService } from '../../users/users-api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ButtonComponent, LinkComponent, InputTextComponent, FormRoot],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private usersApiService = inject(UsersApiService);
  private authService = inject(AuthService);
  private router = inject(Router);

  private model = signal<HwAuthRegisterDto>({
    handle: '',
    email: '',
    password: '',
    passwordRepeat: '',
  });

  private availableEmailResource(
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

  private availableHandleResource(
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

  public form = form(
    this.model,
    (schemaPath) => {
      required(schemaPath.handle, { message: 'Handle is required' });
      maxLength(schemaPath.handle, 12);
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

      required(schemaPath.passwordRepeat, { message: 'Enter your password again' });
      validate(schemaPath.passwordRepeat, ({ value, valueOf }) => {
        const passwordRepeat = value();
        const password = valueOf(schemaPath.password);

        if (passwordRepeat !== password) {
          return {
            kind: 'passwordMismatch',
            message: 'Passwords do not match',
          };
        }
        return null;
      });
    },
    {
      submission: {
        action: async () => {
          const result = await firstValueFrom(this.authService.register(this.model()));

          if (result.user && result.token) {
            void this.router.navigate(['home']);
            return;
          }

          return { kind: 'serverError', message: 'Something went wrong during registration' };
        },
      },
    },
  );
}
