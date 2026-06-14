export const HwShieldSlots = ['shield'] as const;
export type HwShieldSlot = (typeof HwShieldSlots)[number];

export const HwWeaponSlots = ['onehanded', 'twohanded'] as const;
export type HwWeaponSlot = (typeof HwWeaponSlots)[number];

export const HwSlots = [
  ...HwWeaponSlots,
  ...HwShieldSlots,
  'arms',
  'body',
  'cloak',
  'feet',
  'head',
] as const;
export type HwSlot = (typeof HwSlots)[number];

export const HwExclusiveSlots: Record<HwSlot, HwSlot[]> = {
  onehanded: ['twohanded'],
  twohanded: ['onehanded', 'shield'],
  shield: ['twohanded'],
  arms: [],
  body: [],
  cloak: [],
  feet: [],
  head: [],
};
