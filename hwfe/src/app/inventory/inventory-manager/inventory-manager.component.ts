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
  public canEquip = input.required<boolean>();
  public showUnequip = input.required<boolean>();
  public canUnequip = input.required<boolean>();
  public equip = output<HwItem>();
  public unequip = output<HwSlot>();
}
