import { Gender, Klass } from '@hw/prismagen/browser';
import { HwInventory } from '../inventory/inventory.interface.js';
import { HwMe } from '../shared/me.interface.js';

export interface HwCharacter extends HwMe {
  id: number;
  membershipId: number;
  name: string;
  gender: Gender;
  klass: Klass;
  inventory: HwInventory;
}
