import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Field, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-input-text',
  imports: [FormField],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextComponent {
  public field = input.required<Field<string, string>>();
  public label = input.required<string>();
  public type = input<'text' | 'password' | 'email'>('text');
  public autocomplete = input<'username' | 'new-password' | 'current-password' | 'off'>('off');
  public placeholder = input<string | undefined>(undefined);
  public loading = input<boolean>(false);

  public id = `app-input-text-${Math.random().toString(36).substring(2, 9)}`;

  public state = computed(() => this.field()());

  public error = computed(() => this.state().errors()[0]);

  public displayError = computed(() => this.state().touched() && this.error());
}
