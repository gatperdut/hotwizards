import { HwItem } from './item.interface.js';
import { HwSlot } from './slots.const.js';

export interface HwGear extends Record<HwSlot, HwItem | null> {}
