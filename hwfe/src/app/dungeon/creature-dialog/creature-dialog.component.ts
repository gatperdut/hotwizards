import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Movement } from '@hw/prismagen/browser';
import { HwAdventure } from '@hw/shared/adventures';
import {
  creatureAttackDie,
  creatureBodyPoints,
  creatureDefendDie,
  creatureMaxMovementPointsFn,
  creatureMindPoints,
  HwCreature,
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
  adventure: HwAdventure;
  master: HwUser;
  user: HwUser | null;
  creature: HwCreature;
  movement: Movement;
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

  public creatureBodyPoints = creatureBodyPoints;
  public creatureMindPoints = creatureMindPoints;
  public creatureAttackDie = creatureAttackDie;
  public creatureDefendDie = creatureDefendDie;
  public creatureMaxMovementPointsFn = creatureMaxMovementPointsFn;

  public hero = this.data.creature as HwHero;
  public monster = this.data.creature as HwMonster;

  public onEquip(backpackItem: HwItem): void {
    this.adventuresApiService.equipItem(this.data.adventure.id, backpackItem.id).subscribe();
  }

  public onUnequip(slot: HwSlot): void {
    this.adventuresApiService.unequipItem(this.data.adventure.id, slot).subscribe();
  }

  public onDrop(backpackItem: HwItem): void {
    // TODO
  }

  public onDestroyItem(backpackItem: HwItem): void {
    // TODO
  }
}
