import { HwItemName } from './item-name.interface.js';
import { HwSlot } from './slots.const.js';

export const HwItemSlots: Record<HwItemName, HwSlot | null> = {
  dagger: 'onehanded',
  shortsword: 'onehanded',
  broadsword: 'onehanded',
  greatsword: 'twohanded',
  shield: 'shield',
  chainmail: 'body',
  healing_potion: null,
  toolkit: null,
};
