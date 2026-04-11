import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { ButtonComponent } from '../ui/button/button.component';
import { InputTextComponent } from '../ui/input-text/input-text.component';

@Component({
  selector: 'app-showcase',
  imports: [ButtonComponent, InputTextComponent],
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowcaseComponent {
  public form = form(signal({ test: '' }));
}
