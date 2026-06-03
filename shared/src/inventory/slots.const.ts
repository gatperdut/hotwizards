export const ShieldSlots = ['shield'] as const;
export type ShieldSlot = (typeof ShieldSlots)[number];

export const WeaponSlots = ['onehanded', 'twohanded'] as const;
export type WeaponSlot = (typeof WeaponSlots)[number];

export const Slots = [
  'head',
  'body',
  'arms',
  'feet',
  'cloak',
  ...WeaponSlots,
  ...ShieldSlots,
] as const;
export type Slot = (typeof Slots)[number];
