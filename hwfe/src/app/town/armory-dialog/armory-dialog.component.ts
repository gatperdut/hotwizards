import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  HwBackpack,
  HwBuyableItemName,
  HwBuyableItemNames,
  HwItemCosts,
} from '@hw/shared/inventory';
import { ButtonComponent } from '../../ui/button/button.component';
import { DialogRef } from '../../ui/dialog/dialog-ref.class';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { DialogActionsDirective } from '../../ui/dialog/directives/dialog-actions.directive';
import { DialogContentDirective } from '../../ui/dialog/directives/dialog-content.directive';
import { DialogTitleDirective } from '../../ui/dialog/directives/dialog-title.directive';
import { APP_DIALOG_DATA } from '../../ui/dialog/services/dialog.service';

export type ArmoryDialogData = {
  backpack: HwBackpack;
};

export type ArmoryDialogResult = void;

@Component({
  selector: 'app-armory-dialog',
  imports: [
    DialogComponent,
    DialogTitleDirective,
    DialogContentDirective,
    DialogActionsDirective,
    ButtonComponent,
  ],
  templateUrl: './armory-dialog.component.html',
  styleUrl: './armory-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArmoryDialogComponent {
  public data = inject<ArmoryDialogData>(APP_DIALOG_DATA);
  public dialogRef = inject<DialogRef<ArmoryDialogResult>>(DialogRef);

  public buyableItemNames = HwBuyableItemNames.slice();
  public hwItemCosts = HwItemCosts;

  public viewItem(buyableItemName: HwBuyableItemName): void {
    // TODO
  }

  public canBuy(buyableItemName: HwBuyableItemName): boolean {
    return HwItemCosts[buyableItemName] <= this.data.backpack.gold;
  }

  public buy(buyableItemName: HwBuyableItemName): void {
    // TODO
  }
}
