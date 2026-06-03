export const HwItemNames = [
  'dagger',
  'shortsword',
  'broadsword',
  'greatsword',
  'shield',
  'chainmail',
  'healing_potion',
  'toolkit',
] as const;
export type HwItemName = (typeof HwItemNames)[number];
