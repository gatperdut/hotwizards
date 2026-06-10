import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { KlassesService } from '@hw/hwfe/app/characters/services/klasses.service';
import { WhoCharacterComponent } from '@hw/hwfe/app/shared/who-character/who-character.component';
import {
  AppCardAction,
  AppCardMiniAction,
  CardComponent,
} from '@hw/hwfe/app/ui/card/card.component';
import {
  characterAttackDie,
  characterBodyPoints,
  characterDefendDie,
  characterMindPoints,
  characterMovementPoints,
} from '@hw/shared/characters';
import { HwItem, HwSlot } from '@hw/shared/inventory';
import { HwMembership } from '@hw/shared/memberships';
import { CampaignService } from '../../campaigns/campaign/campaign.service';
import { CharactersApiService } from '../../characters/services/characters-api.service';
import { InventoryManagerComponent } from '../../inventory/inventory-manager/inventory-manager.component';
import { DialogService, LazyDialog } from '../../ui/dialog/services/dialog.service';
import {
  ArmoryDialogComponent,
  ArmoryDialogData,
  ArmoryDialogResult,
} from '../armory-dialog/armory-dialog.component';

@Component({
  selector: 'app-town-membership',
  imports: [CardComponent, WhoCharacterComponent, InventoryManagerComponent],
  templateUrl: './town-membership.component.html',
  styleUrl: './town-membership.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TownMembershipComponent {
  private campaignService = inject(CampaignService);
  public klassesService = inject(KlassesService);
  private charactersApiService = inject(CharactersApiService);
  private dialogService = inject(DialogService);

  public membership = input.required<HwMembership>();

  public master = computed(() => this.campaignService.master());
  public myCharacter = computed(() => this.campaignService.myMembership()?.character);
  public character = computed(() => this.membership().character!);
  public inventory = computed(() => this.character().inventory);
  public attackDie = computed(() => characterAttackDie(this.character()));
  public defendDie = computed(() => characterDefendDie(this.character()));
  public movementPoints = computed(() =>
    characterMovementPoints(this.character(), this.campaignService.campaign().ruleset.movement),
  );
  public bodyPoints = computed(() => characterBodyPoints(this.character()));
  public mindPoints = computed(() => characterMindPoints(this.character()));

  public actions = computed(() => {
    const result: AppCardAction[] = [];

    if (this.membership()!.me) {
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
        const dialog: LazyDialog<ArmoryDialogComponent, ArmoryDialogData, ArmoryDialogResult> = {
          importFn: () =>
            import('../armory-dialog/armory-dialog.component').then((m) => m.ArmoryDialogComponent),
        };

        void this.dialogService.open(dialog, { character: this.membership().character! });
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

  public onGiveGold(amount: number): void {
    this.charactersApiService
      .giveGold(this.myCharacter()!.id, this.character().id, amount)
      .subscribe();
  }

  public onDestroyItem(backpackItem: HwItem): void {
    this.charactersApiService.destroyItem(this.character().id, backpackItem.id).subscribe();
  }
}
