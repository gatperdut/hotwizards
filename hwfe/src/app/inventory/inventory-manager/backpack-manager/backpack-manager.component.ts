import { ChangeDetectionStrategy, Component, inject, input, OutputEmitterRef } from '@angular/core';
import { CampaignService } from '@hw/hwfe/app/campaigns/campaign/campaign.service';
import { ButtonComponent } from '@hw/hwfe/app/ui/button/button.component';
import { HwBackpack, HwItem, HwItemSlots } from '@hw/shared/inventory';
import { filter, from, switchMap, tap } from 'rxjs';
import { DialogService, LazyDialog } from '../../../ui/dialog/services/dialog.service';
import {
  ItemDialogAction,
  ItemDialogComponent,
  ItemDialogData,
  ItemDialogResult,
} from '../../item-dialog/item-dialog.component';
import {
  MoveGoldDialogComponent,
  MoveGoldDialogData,
  MoveGoldDialogResult,
} from './move-gold-dialog/move-gold-dialog.component';

@Component({
  selector: 'app-backpack-manager',
  imports: [ButtonComponent],
  templateUrl: './backpack-manager.component.html',
  styleUrl: './backpack-manager.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackpackManagerComponent {
  private dialogService = inject(DialogService);
  private campaignService = inject(CampaignService);

  public backpack = input.required<HwBackpack>();

  public showEquip = input<boolean>(false);
  public canEquip = input<boolean>();
  public equip = input<OutputEmitterRef<HwItem>>();

  public showPickup = input<boolean>(false);
  public canPickup = input<boolean>(false);
  public pickup = input<OutputEmitterRef<HwItem>>();

  public showDrop = input<boolean>(false);
  public canDrop = input<boolean>(false);
  public drop = input<OutputEmitterRef<HwItem>>();

  public showPickupGold = input<boolean>(false);
  public canPickupGold = input<boolean>(false);
  public pickupGold = input<OutputEmitterRef<number>>();

  public showDropGold = input<boolean>(false);
  public canDropGold = input<boolean>(false);
  public dropGold = input<OutputEmitterRef<number>>();

  public showSellItem = input<boolean>(false);
  public canSellItem = input<boolean>(false);
  public sellItem = input<OutputEmitterRef<HwItem>>();

  public showGiveGold = input<boolean>(false);
  public canGiveGold = input<boolean>(false);
  public giveGold = input<OutputEmitterRef<number>>();

  public showDestroyItem = input<boolean>(false);
  public canDestroyItem = input<boolean>(false);
  public destroyItem = input<OutputEmitterRef<HwItem>>();

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

    const sellAction: ItemDialogAction | null = this.showSellItem()
      ? {
          label: 'Sell',
          color: 'primary',
          disabled: !this.canSellItem(),
          callback: (): void => {
            this.sellItem()!.emit(item);
          },
        }
      : null;

    const destroyItemAction: ItemDialogAction | null = this.showDestroyItem()
      ? {
          label: 'Destroy',
          color: 'warning',
          disabled: !this.canDestroyItem(),
          callback: (): void => {
            this.destroyItem()!.emit(item);
          },
        }
      : null;

    const actions: ItemDialogAction[] = [
      destroyItemAction,
      equipAction,
      pickupAction,
      dropAction,
      sellAction,
    ].filter((a) => !!a);

    void this.dialogService.open(dialog, { item: item, actions: actions });
  }

  public pickupGoldAmount(): void {
    const dialog: LazyDialog<MoveGoldDialogComponent, MoveGoldDialogData, MoveGoldDialogResult> = {
      importFn: () =>
        import('./move-gold-dialog/move-gold-dialog.component').then(
          (m) => m.MoveGoldDialogComponent,
        ),
    };

    from(this.dialogService.open(dialog, { type: 'pickup', amount: this.backpack().gold }))
      .pipe(
        switchMap((dialogRef) => dialogRef.afterClosed$),
        filter((amount) => !!amount),
        tap((amount): void => {
          this.pickupGold()!.emit(amount!);
        }),
      )
      .subscribe();
  }

  public dropGoldAmount(): void {
    const dialog: LazyDialog<MoveGoldDialogComponent, MoveGoldDialogData, MoveGoldDialogResult> = {
      importFn: () =>
        import('./move-gold-dialog/move-gold-dialog.component').then(
          (m) => m.MoveGoldDialogComponent,
        ),
    };

    from(this.dialogService.open(dialog, { type: 'drop', amount: this.backpack().gold }))
      .pipe(
        switchMap((dialogRef) => dialogRef.afterClosed$),
        filter((amount) => !!amount),
        tap((amount): void => {
          this.dropGold()!.emit(amount!);
        }),
      )
      .subscribe();
  }

  public giveGoldAmount(): void {
    const dialog: LazyDialog<MoveGoldDialogComponent, MoveGoldDialogData, MoveGoldDialogResult> = {
      importFn: () =>
        import('./move-gold-dialog/move-gold-dialog.component').then(
          (m) => m.MoveGoldDialogComponent,
        ),
    };

    from(
      this.dialogService.open(dialog, {
        type: 'give',
        amount: this.campaignService.myMembership()!.character!.inventory.backpack.gold,
      }),
    )
      .pipe(
        switchMap((dialogRef) => dialogRef.afterClosed$),
        filter((amount) => !!amount),
        tap((amount): void => {
          this.giveGold()!.emit(amount!);
        }),
      )
      .subscribe();
  }
}
