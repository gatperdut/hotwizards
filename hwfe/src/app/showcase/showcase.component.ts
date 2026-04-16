import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { disabled, form, required } from '@angular/forms/signals';
import { ButtonComponent } from '../ui/button/button.component';
import { CheckboxComponent } from '../ui/checkbox/checkbox.component';
import { InputTextComponent } from '../ui/input-text/input-text.component';
import { LinkComponent } from '../ui/link/link.component';
import { ToastService } from '../ui/toast/services/toast.service';

@Component({
  selector: 'app-showcase',
  imports: [ButtonComponent, InputTextComponent, LinkComponent, CheckboxComponent],
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowcaseComponent {
  private toastService = inject(ToastService);

  public form = form(
    signal({
      emptyEnabled: '',
      filledEnabled: 'With required validation',
      disabled: '',
      checkbox1: false,
      checkbox2: false,
      checkbox3: false,
      checkbox4: true,
    }),
    (s) => {
      required(s.filledEnabled, { message: "See? It's required" });
      disabled(s.disabled, () => true);
      disabled(s.checkbox4, () => true);
    },
  );

  public toastInfinite(): void {
    this.toastService.show({ message: 'Stay until you click me', duration: 0 });
  }

  public toast4s(): void {
    this.toastService.show({ message: 'Be gone in 4 seconds' });
  }

  public toastWithActions(): void {
    this.toastService.show({
      message: 'Yes or no?',
      duration: 0,
      actions: [
        { label: 'Yes', color: 'primary', callback: (): void => {} },
        { label: 'No', color: 'warning', callback: (): void => {} },
        { label: 'Maybe', color: 'secondary', callback: (): void => {} },
      ],
    });
  }

  public toastSecondary(): void {
    this.toastService.show({ message: 'Secondary toast', color: 'secondary' });
  }

  public toastWarning(): void {
    this.toastService.show({ message: 'Warning toast', color: 'warning' });
  }
}
