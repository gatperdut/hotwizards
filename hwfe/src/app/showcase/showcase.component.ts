import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { disabled, form } from '@angular/forms/signals';
import { ButtonComponent } from '../ui/button/button.component';
import { InputTextComponent } from '../ui/input-text/input-text.component';
import { LinkComponent } from '../ui/link/link.component';
import { ToastService } from '../ui/toast/services/toast.service';

@Component({
  selector: 'app-showcase',
  imports: [ButtonComponent, InputTextComponent, LinkComponent],
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowcaseComponent {
  private toastService = inject(ToastService);

  public form = form(
    signal({
      emptyEnabled: '',
      filledEnabled: 'Sample input',
      disabled: '',
    }),
    (s) => {
      disabled(s.disabled, () => true);
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
        { label: 'Yes', type: 'primary', callback: (): void => {} },
        { label: 'No', type: 'warning', callback: (): void => {} },
        { label: 'Maybe', type: 'secondary', callback: (): void => {} },
      ],
    });
  }

  public toastSecondary(): void {
    this.toastService.show({ message: 'Secondary toast', type: 'secondary' });
  }

  public toastWarning(): void {
    this.toastService.show({ message: 'Warning toast', type: 'warning' });
  }
}
