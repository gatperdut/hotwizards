import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ResourceRef,
  Signal,
  signal,
} from '@angular/core';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { email, form, minLength, required, validateAsync } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { AuthRegisterDto } from '@hw/shared';
import { debounceTime, from, of, switchMap } from 'rxjs';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputTextComponent } from '../../ui/input-text/input-text.component';
import { LinkComponent } from '../../ui/link/link.component';
import { ToastService } from '../../ui/toast/services/toast.service';
import { UsersApiService } from '../../users/users-api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ButtonComponent, LinkComponent, InputTextComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private usersApiService = inject(UsersApiService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  private model = signal<AuthRegisterDto>({
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

  public form = form(this.model, (schemaPath) => {
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

  public register(): void {
    this.authService
      .register(this.model())
      .pipe(switchMap(() => from(this.router.navigate(['/board']))))
      .subscribe();
  }

  public toast(): void {
    this.toastService.show({
      message: 'Account created! Welcome aboard.',
      duration: 5000,
      actions: [{ label: 'Login', callback: (): void => console.log('Go to login') }],
    });
  }
}
