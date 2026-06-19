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
  creatureBodyPoints,
  creatureDefendDie,
  creatureMaxMovementPointsFn,
  creatureMindPoints,
} from '@hw/shared/dungeon';
import { HwItem } from '@hw/shared/inventory';
import { AdventuresApiService } from '../../adventures/services/adventures-api.service';
import { BackpackManagerComponent } from '../../inventory/inventory-manager/backpack-manager/backpack-manager.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { DialogRef } from '../../ui/dialog/dialog-ref.class';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { DialogActionsDirective } from '../../ui/dialog/directives/dialog-actions.directive';
import { DialogContentDirective } from '../../ui/dialog/directives/dialog-content.directive';
import { DialogTitleDirective } from '../../ui/dialog/directives/dialog-title.directive';
import { APP_DIALOG_DATA } from '../../ui/dialog/services/dialog.service';

export type LootDialogData = {
  campaign: WritableSignal<HwCampaign>;
  heroId: number;
};

export type LootDialogResult = void;

@Component({
  selector: 'app-loot-dialog',
  imports: [
    DialogComponent,
    DialogTitleDirective,
    DialogContentDirective,
    DialogActionsDirective,
    ButtonComponent,
    BackpackManagerComponent,
  ],
  templateUrl: './loot-dialog.component.html',
  styleUrl: './loot-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LootDialogComponent {
  public data = inject<LootDialogData>(APP_DIALOG_DATA);
  public dialogRef = inject<DialogRef<LootDialogResult>>(DialogRef);
  private adventuresApiService = inject(AdventuresApiService);

  public adventure = computed(() => this.data.campaign().adventure!);
  public hero = computed(
    () => [...this.adventure().dungeon.heroes].find((c) => c.id === this.data.heroId)!,
  );
  public cell = computed(() => {
    const hero = this.hero();
    return cellAt(this.adventure().dungeon.cells, hero.x, hero.y)!;
  });
  public loot = computed(() => this.cell()?.loot);

  public creatureBodyPoints = creatureBodyPoints;
  public creatureMindPoints = creatureMindPoints;
  public creatureAttackDie = creatureAttackDie;
  public creatureDefendDie = creatureDefendDie;
  public creatureMaxMovementPointsFn = creatureMaxMovementPointsFn;

  public onPickupItem(lootItem: HwItem): void {
    this.adventuresApiService.pickupItem(this.adventure().id, lootItem.id).subscribe();
  }

  public onPickupGold(amount: number): void {
    this.adventuresApiService.pickupGold(this.adventure().id, amount).subscribe();
  }
}
