import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HwfeColor } from '../../shared/color.const';
import { ButtonComponent } from '../button/button.component';

export type AppCardAction = {
  label: string;
  action: () => void;
  color?: HwfeColor;
};

export type AppCardMiniAction = {
  icon: string;
  action: () => void;
  color?: HwfeColor;
};

@Component({
  selector: 'app-card',
  imports: [ButtonComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  public color = input<HwfeColor>('primary');
  public separatorColor = input<HwfeColor>('secondary');
  public actions = input<AppCardAction[]>([]);
  public miniactions = input<AppCardMiniAction[]>([]);
}
