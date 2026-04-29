import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormRoot, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { HwAuthLoginDto } from '@hw/shared';
import { firstValueFrom } from 'rxjs';
import { ButtonComponent } from '../../ui/button/button.component';
import { CheckboxComponent } from '../../ui/checkbox/checkbox.component';
import { InputTextComponent } from '../../ui/input-text/input-text.component';
import { LinkComponent } from '../../ui/link/link.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ButtonComponent, LinkComponent, InputTextComponent, CheckboxComponent, FormRoot],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  public model = signal<HwAuthLoginDto>({
    identifier: '',
    password: '',
    rememberMe: false,
  });

  public form = form(
    this.model,
    (schemaPath) => {
      required(schemaPath.identifier, { message: 'An identifier is required' });

      required(schemaPath.password, { message: 'Password is required' });
    },
    {
      submission: {
        action: async () => {
          const result = await firstValueFrom(this.authService.login(this.model()));

          if (result.user) {
            void this.router.navigate(['/home']);
            return;
          }

          return { kind: 'authError', message: 'Invalid login' };
        },
      },
    },
  );
}
