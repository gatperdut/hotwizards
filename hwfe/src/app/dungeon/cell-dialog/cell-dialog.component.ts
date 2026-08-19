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
  cellAt,
  creatureAttackDie,
  creatureDefendDie,
  creatureMaxActionPoints,
  creatureMaxBodyPoints,
  creatureMaxMindPoints,
  creatureMaxMovementPointsFn,
  HwHero,
  HwMonster,
  sameCell,
} from '@hw/shared/dungeon';
import { HwItem, HwSlot } from '@hw/shared/inventory';
import { AdventuresApiService } from '../../adventures/services/adventures-api.service';
import { BackpackManagerComponent } from '../../inventory/inventory-manager/backpack-manager/backpack-manager.component';
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
import { DungeonService } from '../services/dungeon.service';

export type CellDialogData = {
  campaign: WritableSignal<HwCampaign>;
  x: number;
  y: number;
};

export type CellDialogResult = void;

@Component({
  selector: 'app-cell-dialog',
  imports: [
    DialogComponent,
    DialogTitleDirective,
    DialogContentDirective,
    DialogActionsDirective,
    ButtonComponent,
    WhoCharacterComponent,
    WhoMonsterComponent,
    StatsComponent,
    BackpackManagerComponent,
    InventoryManagerComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './cell-dialog.component.html',
  styleUrl: './cell-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellDialogComponent {
  public data = inject<CellDialogData>(APP_DIALOG_DATA);
  public dialogRef = inject<DialogRef<CellDialogResult>>(DialogRef);
  private dungeonService = inject(DungeonService);
  private adventuresApiService = inject(AdventuresApiService);

  public adventure = computed(() => this.data.campaign().adventure!);
  public cells = computed(() => this.adventure().dungeon.cells);
  public cell = computed(() => cellAt(this.cells(), this.data.x, this.data.y)!);
  public master = computed(() => this.data.campaign().master);
  public activePlayer = computed(() => this.dungeonService.activePlayer());
  public creature = computed(() =>
    [...this.adventure().dungeon.heroes, ...this.adventure().dungeon.monsters].find((c) =>
      sameCell(this.cell(), cellAt(this.cells(), c.x, c.y)!),
    ),
  );
  public hero = computed(() => this.creature() as HwHero);
  public monster = computed(() => this.creature() as HwMonster);
  public creatureUser = computed(() => {
    const creature = this.creature();
    if (!creature || creature.alignment !== 'HERO') {
      return null;
    }
    return this.data.campaign().memberships.find((m) => m.id === creature.membershipId)!.user;
  });
  public loot = computed(() => this.cell().loot);

  public creatureMaxBodyPoints = creatureMaxBodyPoints;
  public creatureMaxMindPoints = creatureMaxMindPoints;
  public creatureAttackDie = creatureAttackDie;
  public creatureDefendDie = creatureDefendDie;
  public creatureMaxActionPoints = creatureMaxActionPoints;
  public creatureMaxMovementPointsFn = creatureMaxMovementPointsFn;

  public onEquip(backpackItem: HwItem): void {
    this.adventuresApiService.equipItem(this.adventure().id, backpackItem.id).subscribe();
  }

  public onUnequip(slot: HwSlot): void {
    this.adventuresApiService.unequipItem(this.adventure().id, slot).subscribe();
  }

  public onDropItem(backpackItem: HwItem): void {
    this.adventuresApiService.dropItem(this.adventure().id, backpackItem.id).subscribe();
  }

  public onDestroyItem(backpackItem: HwItem): void {
    this.adventuresApiService.destroyItem(this.adventure().id, backpackItem.id).subscribe();
  }

  public onPickupItem(lootItem: HwItem): void {
    this.adventuresApiService.pickupItem(this.adventure().id, lootItem.id).subscribe();
  }

  public onPickupGold(amount: number): void {
    this.adventuresApiService.pickupGold(this.adventure().id, amount).subscribe();
  }
}
