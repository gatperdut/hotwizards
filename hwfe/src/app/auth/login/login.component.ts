import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { AuthLoginDto } from '@hw/shared';
import { from, switchMap } from 'rxjs';
import { ButtonComponent } from '../../ui/button/button.component';
import { CheckboxComponent } from '../../ui/checkbox/checkbox.component';
import { InputTextComponent } from '../../ui/input-text/input-text.component';
import { LinkComponent } from '../../ui/link/link.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ButtonComponent, LinkComponent, InputTextComponent, FormsModule, CheckboxComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  public model = signal<AuthLoginDto>({
    email: '',
    password: '',
    rememberMe: false,
  });

  public form = form(this.model, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });

    required(schemaPath.password, { message: 'Password is required' });
  });

  public login(): void {
    this.authService
      .login(this.model())
      .pipe(switchMap(() => from(this.router.navigate(['/home']))))
      .subscribe();
  }
}
