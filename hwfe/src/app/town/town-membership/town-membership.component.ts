import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { KlassesService } from '@hw/hwfe/app/characters/services/klasses.service';
import { WhoCharacterComponent } from '@hw/hwfe/app/shared/who-character/who-character.component';
import {
  AppCardAction,
  AppCardMiniAction,
  CardComponent,
} from '@hw/hwfe/app/ui/card/card.component';
import { HwCharacter } from '@hw/shared/characters';
import { HwMembership } from '@hw/shared/memberships';

@Component({
  selector: 'app-town-membership',
  imports: [CardComponent, WhoCharacterComponent],
  templateUrl: './town-membership.component.html',
  styleUrl: './town-membership.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TownMembershipComponent {
  public klassesService = inject(KlassesService);

  public membership = input.required<HwMembership>();

  public character = computed(() => this.membership().character as HwCharacter);

  public actions = computed(() => {
    const result: AppCardAction[] = [];

    if (this.membership().me) {
      result.push(this.buyAction());
    }

    return result;
  });

  public miniactions = computed(() => {
    const result: AppCardMiniAction[] = [];

    return result;
  });

  private buyAction(): AppCardAction {
    return {
      label: 'Buy',
      color: 'primary',
      action: (): void => {
        //TODO
      },
    };
  }
}
