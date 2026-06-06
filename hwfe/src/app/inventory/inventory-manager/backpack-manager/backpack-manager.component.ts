import { ChangeDetectionStrategy, Component, inject, input, OutputEmitterRef } from '@angular/core';
import { HwBackpack, HwItem, HwItemSlots } from '@hw/shared/inventory';
import { DialogService, LazyDialog } from '../../../ui/dialog/services/dialog.service';
import {
  ItemDialogAction,
  ItemDialogComponent,
  ItemDialogData,
  ItemDialogResult,
} from '../../item-dialog/item-dialog.component';

@Component({
  selector: 'app-backpack-manager',
  imports: [],
  templateUrl: './backpack-manager.component.html',
  styleUrl: './backpack-manager.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackpackManagerComponent {
  private dialogService = inject(DialogService);

  public backpack = input.required<HwBackpack>();

  public showEquip = input.required<boolean>();
  public canEquip = input<boolean>();
  public equip = input<OutputEmitterRef<HwItem>>();

  public showPickup = input.required<boolean>();
  public canPickup = input<boolean>(false);
  public pickup = input<OutputEmitterRef<HwItem>>();

  public showDrop = input.required<boolean>();
  public canDrop = input<boolean>(false);
  public drop = input<OutputEmitterRef<HwItem>>();

  public viewItem(item: HwItem): void {
    const dialog: LazyDialog<ItemDialogComponent, ItemDialogData, ItemDialogResult> = {
      importFn: () =>
        import('../../item-dialog/item-dialog.component').then((m) => m.ItemDialogComponent),
    };

    const equipAction: ItemDialogAction | null =
      this.showEquip() && HwItemSlots[item.name]
        ? {
            label: 'Equip',
            color: 'primary',
            disabled: !this.canEquip(),
            callback: (): void => {
              this.equip()!.emit(item);
            },
          }
        : null;

    const pickupAction: ItemDialogAction | null = this.showPickup()
      ? {
          label: 'Pick up',
          color: 'primary',
          disabled: !this.canPickup(),
          callback: (): void => {
            this.pickup()!.emit(item);
          },
        }
      : null;

    const dropAction: ItemDialogAction | null = this.showDrop()
      ? {
          label: 'Drop',
          color: 'primary',
          disabled: !this.canDrop(),
          callback: (): void => {
            this.drop()!.emit(item);
          },
        }
      : null;

    const actions: ItemDialogAction[] = [equipAction, pickupAction, dropAction].filter((a) => !!a);

    void this.dialogService.open(dialog, { item: item, actions: actions });
  }
}
