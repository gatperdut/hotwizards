import { HwItemName } from './item-names.const.js';
import { HwSlot } from './slots.const.js';

export const HwItemSlots: Record<HwItemName, HwSlot | null> = {
  goblin_dagger: 'onehanded',
  goblin_sword: 'onehanded',
  goblin_axe: 'onehanded',
  orc_mace: 'onehanded',
  orc_sword: 'onehanded',
  orc_cleaver: 'onehanded',
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
