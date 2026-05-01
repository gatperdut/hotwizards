import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { KlassesService } from '@hw/hwfe/app/characters/services/klasses.service';
import {
  AppCardAction,
  AppCardMiniAction,
  CardComponent,
} from '@hw/hwfe/app/ui/card/card.component';
import { HwCharacter, HwMembership, HwUser } from '@hw/shared';

@Component({
  selector: 'app-town-membership',
  imports: [CardComponent],
  templateUrl: './town-membership.component.html',
  styleUrl: './town-membership.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TownMembershipComponent {
  public klassesService = inject(KlassesService);

  public membership = input.required<HwMembership>();

  public pending = computed(() => this.membership().status === 'PENDING');
  public member = computed(() => this.membership().user as HwUser);
  public character = computed(() => this.membership().character as HwCharacter);

  public actions = computed(() => {
    const result: AppCardAction[] = [];

    return result;
  });

  public miniactions = computed(() => {
    const result: AppCardMiniAction[] = [];

    return result;
  });
}
