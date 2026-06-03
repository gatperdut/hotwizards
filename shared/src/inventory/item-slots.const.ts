import { ItemName } from './item-name.interface.js';
import { Slot } from './slots.const.js';

export const ItemSlots: Record<ItemName, Slot | null> = {
  dagger: 'onehanded',
  shortsword: 'onehanded',
  broadsword: 'onehanded',
  greatsword: 'twohanded',
  shield: 'shield',
  chainmail: 'body',
  healing_potion: null,
  toolkit: null,
};
