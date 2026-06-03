import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HwInventory, HwSlots } from '@hw/shared/inventory';

@Component({
  selector: 'app-inventory-manager',
  imports: [],
  templateUrl: './inventory-manager.component.html',
  styleUrl: './inventory-manager.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryManagerComponent {
  public inventory = input.required<HwInventory>();

  public slots = HwSlots.slice();
}
