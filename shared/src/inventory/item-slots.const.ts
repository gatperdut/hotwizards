import { HwItemName } from './item-name.const.js';
import { HwSlot } from './slots.const.js';

export const HwItemSlots: Record<HwItemName, HwSlot | null> = {
  dagger: 'onehanded',
  handaxe: 'onehanded',
  battleaxe: 'twohanded',
  staff: 'twohanded',
  spear: 'twohanded',
  shortsword: 'onehanded',
  broadsword: 'onehanded',
  greatsword: 'twohanded',
  crossbow: 'twohanded',
  buckler: 'shield',
  shield: 'shield',
  padded_armor: 'body',
  leather_armor: 'body',
  chainmail: 'body',
  plate_armor: 'body',
  helmet: 'head',
  healing_potion: null,
  toolkit: null,
};
