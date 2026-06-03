export const HwShieldSlots = ['shield'] as const;
export type HwShieldSlot = (typeof HwShieldSlots)[number];

export const HwWeaponSlots = ['onehanded', 'twohanded'] as const;
export type HwWeaponSlot = (typeof HwWeaponSlots)[number];

export const HwSlots = [
  'head',
  'body',
  'arms',
  'feet',
  'cloak',
  ...HwWeaponSlots,
  ...HwShieldSlots,
] as const;
export type HwSlot = (typeof HwSlots)[number];
