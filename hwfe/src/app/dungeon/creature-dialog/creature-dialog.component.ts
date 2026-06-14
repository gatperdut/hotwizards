import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  WritableSignal,
} from '@angular/core';
import { HwCampaign } from '@hw/shared/campaigns';
import {
  creatureAttackDie,
  creatureBodyPoints,
  creatureDefendDie,
  creatureMaxMovementPointsFn,
  creatureMindPoints,
  HwHero,
  HwMonster,
} from '@hw/shared/dungeon';
import { HwItem, HwSlot } from '@hw/shared/inventory';
import { HwUser } from '@hw/shared/users';
import { AdventuresApiService } from '../../adventures/services/adventures-api.service';
import { InventoryManagerComponent } from '../../inventory/inventory-manager/inventory-manager.component';
import { WhoCharacterComponent } from '../../shared/who-character/who-character.component';
import { WhoMonsterComponent } from '../../shared/who-monster/who-monster.component';
import { StatsComponent } from '../../stats/stats.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { DialogRef } from '../../ui/dialog/dialog-ref.class';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { DialogActionsDirective } from '../../ui/dialog/directives/dialog-actions.directive';
import { DialogContentDirective } from '../../ui/dialog/directives/dialog-content.directive';
import { DialogTitleDirective } from '../../ui/dialog/directives/dialog-title.directive';
import { APP_DIALOG_DATA } from '../../ui/dialog/services/dialog.service';

export type CreatureDialogData = {
  campaign: WritableSignal<HwCampaign>;
  user: HwUser | null;
  creatureId: number;
};

export type CreatureDialogResult = void;

@Component({
  selector: 'app-creature-dialog',
  imports: [
    DialogComponent,
    DialogTitleDirective,
    DialogContentDirective,
    DialogActionsDirective,
    ButtonComponent,
    WhoCharacterComponent,
    WhoMonsterComponent,
    StatsComponent,
    InventoryManagerComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './creature-dialog.component.html',
  styleUrl: './creature-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatureDialogComponent {
  public data = inject<CreatureDialogData>(APP_DIALOG_DATA);
  public dialogRef = inject<DialogRef<CreatureDialogResult>>(DialogRef);
  private adventuresApiService = inject(AdventuresApiService);

  public adventure = computed(() => this.data.campaign().adventure!);
  public master = computed(() => this.data.campaign().master);
  public creature = computed(
    () =>
      [...this.adventure().dungeon.heroes, ...this.adventure().dungeon.monsters].find(
        (c) => c.id === this.data.creatureId,
      )!,
  );

  public creatureBodyPoints = creatureBodyPoints;
  public creatureMindPoints = creatureMindPoints;
  public creatureAttackDie = creatureAttackDie;
  public creatureDefendDie = creatureDefendDie;
  public creatureMaxMovementPointsFn = creatureMaxMovementPointsFn;
  public hero = computed(() => this.creature() as HwHero);
  public monster = computed(() => this.creature() as HwMonster);

  public onEquip(backpackItem: HwItem): void {
    this.adventuresApiService.equipItem(this.adventure().id, backpackItem.id).subscribe();
  }

  public onUnequip(slot: HwSlot): void {
    this.adventuresApiService.unequipItem(this.adventure().id, slot).subscribe();
  }

  public onDrop(backpackItem: HwItem): void {
    // TODO
  }

  public onDestroyItem(backpackItem: HwItem): void {
    // TODO
  }
}
