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
  public canEquip = input.required<boolean>();
  public equip = input.required<OutputEmitterRef<HwItem>>();

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
              this.equip().emit(item);
            },
          }
        : null;

    const actions: ItemDialogAction[] = [equipAction].filter((a) => !!a);

    void this.dialogService.open(dialog, { item: item, actions: actions });
  }
}
