import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { form, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { AuthLoginDto } from '@hw/shared';
import { from, map, switchMap } from 'rxjs';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputTextComponent } from '../../ui/input-text/input-text.component';
import { LinkComponent } from '../../ui/link/link.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [AsyncPipe, JsonPipe, ButtonComponent, LinkComponent, InputTextComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  private model = signal<AuthLoginDto>({
    email: '',
    password: '',
  });

  public form = form(this.model, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });

    required(schemaPath.password, { message: 'Password is required' });
  });

  public emailError$ = toObservable(this.form.email().errors).pipe(map((errors) => errors.at(0)));

  public login(): void {
    this.authService
      .login(this.form().value())
      .pipe(switchMap(() => from(this.router.navigate(['/board']))))
      .subscribe();
  }
}
