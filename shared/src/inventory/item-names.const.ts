export const HwMonsterWeaponItemNames = [
  'goblin_dagger',
  'goblin_sword',
  'goblin_axe',
  'orc_mace',
  'orc_sword',
  'orc_cleaver',
] as const;

export type HwMonsterWeaponItemName = (typeof HwMonsterWeaponItemNames)[number];

export const HwWeaponItemNames = [
  'dagger',
  'handaxe',
  'battleaxe',
  'staff',
  'spear',
  'shortsword',
  'broadsword',
  'greatsword',
  'crossbow',
] as const;
export type HwWeaponItemName = (typeof HwWeaponItemNames)[number];

export const HwShieldItemNames = ['buckler', 'shield'] as const;
export type HwShieldItemName = (typeof HwShieldItemNames)[number];

export const HwArmorItemNames = [
  'padded_armor',
  'leather_armor',
  'chainmail',
  'plate_armor',
  'helmet',
] as const;
export type HwArmorItemName = (typeof HwArmorItemNames)[number];

export const HwPotionItemNames = ['healing_potion'] as const;
export type HwPotionItemName = (typeof HwPotionItemNames)[number];

export const HwMiscItemNames = ['toolkit'] as const;
export type HwMiscItemName = (typeof HwMiscItemNames)[number];

export const HwItemNames = [
  ...HwMonsterWeaponItemNames,
  ...HwWeaponItemNames,
  ...HwShieldItemNames,
  ...HwArmorItemNames,
  ...HwPotionItemNames,
  ...HwMiscItemNames,
] as const;
export type HwItemName = (typeof HwItemNames)[number];

export const HwBuyableItemNames = HwItemNames.filter(
  (name): name is Exclude<HwItemName, HwMonsterWeaponItemName> =>
    !(HwMonsterWeaponItemNames as readonly string[]).includes(name),
);

export type HwBuyableItemName = (typeof HwBuyableItemNames)[number];
