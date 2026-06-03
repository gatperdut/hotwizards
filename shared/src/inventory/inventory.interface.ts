import { HwBackpack } from './backpack.interface.js';
import { HwGear } from './gear.interface.js';

export interface HwInventory {
  gear: HwGear;
  backpack: HwBackpack;
}
