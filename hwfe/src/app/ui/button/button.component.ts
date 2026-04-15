import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  public type = input<'button' | 'submit'>('button');

  public label = input.required<string>();

  public color = input<'primary' | 'secondary' | 'warning'>('primary');

  public disabled = input<boolean>(false);
}
