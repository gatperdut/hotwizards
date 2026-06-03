import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { HwInventory, HwItem, HwItemSlots, HwSlot, HwSlots } from '@hw/shared/inventory';
import { DialogService, LazyDialog } from '../../ui/dialog/services/dialog.service';
import { InventoryCanFn } from '../consts/inventory-can-fn.const';
import { ItemSource } from '../consts/item-source.const';
import {
  ItemDialogAction,
  ItemDialogComponent,
  ItemDialogData,
  ItemDialogResult,
} from '../item-dialog/item-dialog.component';

@Component({
  selector: 'app-inventory-manager',
  imports: [],
  templateUrl: './inventory-manager.component.html',
  styleUrl: './inventory-manager.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryManagerComponent {
  private dialogService = inject(DialogService);

  public inventory = input.required<HwInventory>();
  public canEquip = input.required<InventoryCanFn>();
  public canUnequip = input.required<InventoryCanFn>();
  public equip = output<HwItem>();
  public unequip = output<HwSlot>();

  public slots = HwSlots.slice();

  public viewItem(item: HwItem, source: ItemSource): void {
    const dialog: LazyDialog<ItemDialogComponent, ItemDialogData, ItemDialogResult> = {
      importFn: () =>
        import('../item-dialog/item-dialog.component').then((m) => m.ItemDialogComponent),
    };

    const equipAction: ItemDialogAction | null =
      source === 'backpack' && !!HwItemSlots[item.name]
        ? {
            label: 'Equip',
            color: 'primary',
            disabled: !this.canEquip(),
            callback: (): void => {
              console.log('equip');
            },
          }
        : null;

    const unequipAction: ItemDialogAction | null =
      source === 'gear'
        ? {
            label: 'Unequip',
            color: 'secondary',
            disabled: !this.canUnequip(),
            callback: (): void => {
              console.log('unequip');
            },
          }
        : null;

    const actions: ItemDialogAction[] = [equipAction, unequipAction].filter((a) => !!a);

    void this.dialogService.open(dialog, { item: item, actions: actions });
  }
}
