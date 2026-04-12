import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { disabled, form } from '@angular/forms/signals';
import { ButtonComponent } from '../ui/button/button.component';
import { InputTextComponent } from '../ui/input-text/input-text.component';
import { LinkComponent } from '../ui/link/link.component';

@Component({
  selector: 'app-showcase',
  imports: [ButtonComponent, InputTextComponent, LinkComponent],
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowcaseComponent {
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
}
