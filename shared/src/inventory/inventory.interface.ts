import { Backpack } from './backpack.interface.js';
import { Gear } from './gear.interface.js';

export interface Inventory {
  gear: Gear;
  backpack: Backpack;
}
