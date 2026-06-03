import { Item } from './item.interface.js';
import { Slot } from './slots.const.js';

export interface Gear extends Record<Slot, Item | null> {}
