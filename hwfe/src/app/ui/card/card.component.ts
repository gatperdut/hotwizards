import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

export type AppCardAction = {
  label: string;
  action: () => void;
  color?: 'primary' | 'secondary' | 'warning';
};

export type AppCardMiniAction = {
  icon: string;
  action: () => void;
  color?: 'primary' | 'secondary' | 'warning';
};

@Component({
  selector: 'app-card',
  imports: [ButtonComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  public color = input<'primary' | 'secondary' | 'warning'>('primary');

  public separatorColor = input<'primary' | 'secondary' | 'warning'>('secondary');

  public actions = input<AppCardAction[]>([]);

  public miniactions = input<AppCardMiniAction[]>([]);
}
