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

  public showDrop = input.required<boolean>();
  public canDrop = input<boolean>(false);
  public drop = output<HwItem>();

  public showSellItem = input.required<boolean>();
  public canSellItem = input<boolean>(false);
  public sellItem = output<HwItem>();
}
