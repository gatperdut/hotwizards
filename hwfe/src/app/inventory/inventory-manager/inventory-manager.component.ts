import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { HwInventory, HwItem, HwSlot } from '@hw/shared/inventory';
import { BackpackManagerComponent } from './backpack-manager/backpack-manager.component';
import { GearManagerComponent } from './gear-manager/gear-manager.component';

@Component({
  selector: 'app-inventory-manager',
  imports: [GearManagerComponent, BackpackManagerComponent],
  templateUrl: './inventory-manager.component.html',
  styleUrl: './inventory-manager.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryManagerComponent {
  public inventory = input.required<HwInventory>();

  public showEquip = input.required<boolean>();
  public canEquip = input<boolean>(false);
  public equip = output<HwItem>();

  public showUnequip = input.required<boolean>();
  public canUnequip = input<boolean>(false);
  public unequip = output<HwSlot>();

  public showDropItem = input.required<boolean>();
  public canDropItem = input<boolean>(false);
  public dropItem = output<HwItem>();

  public showSellItem = input.required<boolean>();
  public canSellItem = input<boolean>(false);
  public sellItem = output<HwItem>();

  public showGiveGold = input.required<boolean>();
  public canGiveGold = input<boolean>(false);
  public giveGold = output<number>();

  public showDestroyItem = input.required<boolean>();
  public canDestroyItem = input<boolean>(false);
  public destroyItem = output<HwItem>();
}
