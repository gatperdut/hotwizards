import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-tag',
  imports: [IconComponent],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
  public label = input.required<string>();
  public icon = input<string>();
  public callback = output<void>();
}
