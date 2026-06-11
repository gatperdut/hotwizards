import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HwCharacter } from '@hw/shared/characters';
import { HwBuyableItemName, HwBuyableItemNames, HwItemCosts } from '@hw/shared/inventory';
import { tap } from 'rxjs';
import { CharactersApiService } from '../../characters/services/characters-api.service';
import {
  ItemDialogComponent,
  ItemDialogData,
  ItemDialogResult,
} from '../../inventory/item-dialog/item-dialog.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { DialogRef } from '../../ui/dialog/dialog-ref.class';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { DialogActionsDirective } from '../../ui/dialog/directives/dialog-actions.directive';
import { DialogContentDirective } from '../../ui/dialog/directives/dialog-content.directive';
import { DialogTitleDirective } from '../../ui/dialog/directives/dialog-title.directive';
import {
  APP_DIALOG_DATA,
  DialogService,
  LazyDialog,
} from '../../ui/dialog/services/dialog.service';

export type ArmoryDialogData = {
  character: HwCharacter;
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
  private charactersApiService = inject(CharactersApiService);
  private dialogService = inject(DialogService);

  public buyableItemNames = HwBuyableItemNames.slice();
  public hwItemCosts = HwItemCosts;

  public viewItem(buyableItemName: HwBuyableItemName): void {
    const dialog: LazyDialog<ItemDialogComponent, ItemDialogData, ItemDialogResult> = {
      importFn: () =>
        import('../../inventory/item-dialog/item-dialog.component').then(
          (m) => m.ItemDialogComponent,
        ),
    };

    void this.dialogService.open(dialog, {
      item: { id: crypto.randomUUID(), name: buyableItemName },
      actions: [],
    });
  }

  public canBuy(buyableItemName: HwBuyableItemName): boolean {
    return HwItemCosts[buyableItemName] <= this.data.character.inventory.backpack.gold;
  }

  public buy(buyableItemName: HwBuyableItemName): void {
    this.charactersApiService
      .buyItem(this.data.character.id, buyableItemName)
      .pipe(
        tap(() => {
          this.dialogRef.close();
        }),
      )
      .subscribe();
  }
}
