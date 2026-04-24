import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-button',
  imports: [IconComponent],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  public type = input<'button' | 'submit'>('button');
  public appearance = input<'filled' | 'outlined'>('filled');
  public label = input<string | undefined>(undefined);
  public icon = input<string | undefined>(undefined);
  public color = input<'primary' | 'secondary' | 'warning'>('primary');
  public disabled = input<boolean>(false);
  public classes = computed(() => `${this.color()} ${this.appearance()}`);
}
