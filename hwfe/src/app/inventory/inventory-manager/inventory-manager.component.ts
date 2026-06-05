import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { HwInventory, HwItem, HwItemSlots, HwSlot, HwSlots } from '@hw/shared/inventory';
import { DialogService, LazyDialog } from '../../ui/dialog/services/dialog.service';
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
  public canEquip = input.required<boolean>();
  public canUnequip = input.required<boolean>();
  public equip = output<HwItem>();
  public unequip = output<HwSlot>();

  public slots = HwSlots.slice();

  public viewItem(item: HwItem, source: ItemSource): void {
    const dialog: LazyDialog<ItemDialogComponent, ItemDialogData, ItemDialogResult> = {
      importFn: () =>
        import('../item-dialog/item-dialog.component').then((m) => m.ItemDialogComponent),
    };

    const equipAction: ItemDialogAction | null =
      this.canEquip() && source === 'backpack' && !!HwItemSlots[item.name]
        ? {
            label: 'Equip',
            color: 'primary',
            disabled: !this.canEquip(),
            callback: (): void => {
              this.equip.emit(item);
            },
          }
        : null;

    const unequipAction: ItemDialogAction | null =
      this.canUnequip() && source === 'gear'
        ? {
            label: 'Unequip',
            color: 'secondary',
            disabled: !this.canUnequip(),
            callback: (): void => {
              this.unequip.emit(
                HwSlots.find((slot) => this.inventory().gear[slot]?.id === item.id)!,
              );
            },
          }
        : null;

    const actions: ItemDialogAction[] = [equipAction, unequipAction].filter((a) => !!a);

    void this.dialogService.open(dialog, { item: item, actions: actions });
  }
}
