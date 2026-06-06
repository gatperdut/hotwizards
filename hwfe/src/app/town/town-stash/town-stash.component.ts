import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CardComponent } from '@hw/hwfe/app/ui/card/card.component';
import { HwCharacter } from '@hw/shared/characters';
import { HwBackpack, HwItem } from '@hw/shared/inventory';
import { BackpackManagerComponent } from '../../inventory/inventory-manager/backpack-manager/backpack-manager.component';

@Component({
  selector: 'app-town-stash',
  imports: [CardComponent, BackpackManagerComponent],
  templateUrl: './town-stash.component.html',
  styleUrl: './town-stash.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TownStashComponent {
  public character = input.required<HwCharacter | undefined>();
  public stash = input.required<HwBackpack>();
  public pickup = output<HwItem>();
  public pickupGold = output<number>();
}
