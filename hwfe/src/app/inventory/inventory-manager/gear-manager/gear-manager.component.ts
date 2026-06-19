import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { HwGear, HwItem, HwSlot, HwSlots } from '@hw/shared/inventory';
import { DialogService, LazyDialog } from '../../../ui/dialog/services/dialog.service';
import {
  ItemDialogAction,
  ItemDialogComponent,
  ItemDialogData,
  ItemDialogResult,
} from '../../item-dialog/item-dialog.component';

@Component({
  selector: 'app-gear-manager',
  imports: [],
  templateUrl: './gear-manager.component.html',
  styleUrl: './gear-manager.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GearManagerComponent {
  private dialogService = inject(DialogService);

  public gear = input.required<HwGear>();
  public showUnequip = input<boolean>();
  public canUnequip = input<boolean>();
  public unequip = output<HwSlot>();

  public slots = HwSlots.slice();

  public viewItem(item: HwItem): void {
    const dialog: LazyDialog<ItemDialogComponent, ItemDialogData, ItemDialogResult> = {
      importFn: () =>
        import('../../item-dialog/item-dialog.component').then((m) => m.ItemDialogComponent),
    };

    const unequipAction: ItemDialogAction | null = this.showUnequip()
      ? {
          label: 'Unequip',
          color: 'secondary',
          disabled: !this.canUnequip(),
          callback: (): void => {
            this.unequip.emit(HwSlots.find((slot) => this.gear()[slot]?.id === item.id)!);
          },
        }
      : null;
    const actions: ItemDialogAction[] = [unequipAction].filter((a) => !!a);

    void this.dialogService.open(dialog, { item: item, actions: actions });
  }
}
