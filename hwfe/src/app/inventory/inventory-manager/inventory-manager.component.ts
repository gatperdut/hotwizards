import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { HwInventory, HwItem, HwSlot, HwSlots } from '@hw/shared/inventory';
import { DialogService, LazyDialog } from '../../ui/dialog/services/dialog.service';
import {
  ItemDialogComponent,
  ItemDialogData,
  ItemDialogResult,
} from '../item-dialog/item-dialog.component';

export type InventoryCanFn = () => boolean;

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

  public viewItem(item: HwItem): void {
    const dialog: LazyDialog<ItemDialogComponent, ItemDialogData, ItemDialogResult> = {
      importFn: () =>
        import('../item-dialog/item-dialog.component').then((m) => m.ItemDialogComponent),
    };

    void this.dialogService.open(dialog, { item: item });
  }
}
