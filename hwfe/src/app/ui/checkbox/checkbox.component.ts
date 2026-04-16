import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Field, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-checkbox',
  imports: [FormField],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent {
  public field = input.required<Field<boolean, string>>();
  public label = input.required<string>();
  public color = input<'primary' | 'secondary' | 'warning'>('primary');

  public id = `app-checkbox-${Math.random().toString(36).substring(2, 9)}`;

  public state = computed(() => this.field()());
}
