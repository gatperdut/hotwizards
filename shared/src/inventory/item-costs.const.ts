import {
  HwArmorItemName,
  HwMiscItemName,
  HwMonsterWeaponItemName,
  HwPotionItemName,
  HwShieldItemName,
  HwWeaponItemName,
} from './item-name.const.js';

export const HwMonsterWeaponItemCosts: Record<HwMonsterWeaponItemName, number> = {
  goblin_dagger: 0,
  goblin_sword: 0,
  goblin_axe: 0,
  orc_mace: 0,
  orc_sword: 0,
  orc_cleaver: 0,
};

export const HwWeaponItemCosts: Record<HwWeaponItemName, number> = {
  dagger: 25,
  handaxe: 150,
  battleaxe: 400,
  staff: 100,
  spear: 150,
  shortsword: 150,
  broadsword: 250,
  greatsword: 400,
  crossbow: 350,
};

export const HwShieldItemCosts: Record<HwShieldItemName, number> = {
  buckler: 75,
  shield: 100,
};

export const HwArmorItemCosts: Record<HwArmorItemName, number> = {
  padded_armor: 200,
  leather_armor: 325,
  chainmail: 450,
  plate_armor: 850,
  helmet: 125,
};

export const HwPotionItemCosts: Record<HwPotionItemName, number> = {
  healing_potion: 75,
};

export const HwMiscItemCosts: Record<HwMiscItemName, number> = {
  toolkit: 250,
};

export const HwItemCosts = {
  ...HwWeaponItemCosts,
  ...HwShieldItemCosts,
  ...HwArmorItemCosts,
  ...HwPotionItemCosts,
  ...HwMiscItemCosts,
};
