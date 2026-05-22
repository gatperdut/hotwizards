export const MonsterTypes = [
  'chaos_mage',
  'chaos_warrior',
  'fimir',
  'gargoyle',
  'goblin_axe',
  'goblin_dagger',
  'goblin_sword',
  'mummy',
  'orc_cleaver',
  'orc_mace',
  'orc_sword',
  'skeleton',
  'zombie',
] as const;

export type MonsterType = (typeof MonsterTypes)[number];
