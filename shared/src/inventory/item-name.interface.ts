export const ItemNames = [
  'dagger',
  'shortsword',
  'broadsword',
  'greatsword',
  'shield',
  'chainmail',
  'healing_potion',
  'toolkit',
] as const;
export type ItemName = (typeof ItemNames)[number];
