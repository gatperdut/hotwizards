import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { KlassesService } from '@hw/hwfe/app/characters/services/klasses.service';
import { WhoCharacterComponent } from '@hw/hwfe/app/shared/who-character/who-character.component';
import {
  AppCardAction,
  AppCardMiniAction,
  CardComponent,
} from '@hw/hwfe/app/ui/card/card.component';
import { HwItem, HwSlot } from '@hw/shared/inventory';
import { HwMembership } from '@hw/shared/memberships';
import { CharactersApiService } from '../../characters/services/characters-api.service';
import { InventoryManagerComponent } from '../../inventory/inventory-manager/inventory-manager.component';

@Component({
  selector: 'app-town-membership',
  imports: [CardComponent, WhoCharacterComponent, InventoryManagerComponent],
  templateUrl: './town-membership.component.html',
  styleUrl: './town-membership.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TownMembershipComponent {
  public klassesService = inject(KlassesService);
  private charactersApiService = inject(CharactersApiService);

  public membership = input.required<HwMembership>();

  public character = computed(() => this.membership().character!);
  public inventory = computed(() => this.character().inventory);

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

  public onEquip(backpackItem: HwItem): void {
    this.charactersApiService.equipItem(this.character().id, backpackItem.id).subscribe();
  }

  public onUnequip(slot: HwSlot): void {
    this.charactersApiService.unequipItem(this.character().id, slot).subscribe();
  }

  public onDrop(backpackItem: HwItem): void {
    this.charactersApiService.dropItem(this.character().id, backpackItem.id).subscribe();
  }

  public onSellItem(backpackItem: HwItem): void {
    this.charactersApiService.sellItem(this.character().id, backpackItem.id).subscribe();
  }
}
