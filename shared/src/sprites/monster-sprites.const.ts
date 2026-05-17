import { Direction } from '../directions/directions.const.js';

export const MonsterSpritePaths = [
  '/tiles/monsters/chaos_mage_n.png',
  '/tiles/monsters/chaos_mage_e.png',
  '/tiles/monsters/chaos_mage_s.png',
  '/tiles/monsters/chaos_mage_w.png',
  '/tiles/monsters/chaos_warrior_n.png',
  '/tiles/monsters/chaos_warrior_e.png',
  '/tiles/monsters/chaos_warrior_s.png',
  '/tiles/monsters/chaos_warrior_w.png',
  '/tiles/monsters/fimir_n.png',
  '/tiles/monsters/fimir_e.png',
  '/tiles/monsters/fimir_s.png',
  '/tiles/monsters/fimir_w.png',
  '/tiles/monsters/gargoyle_n.png',
  '/tiles/monsters/gargoyle_e.png',
  '/tiles/monsters/gargoyle_s.png',
  '/tiles/monsters/gargoyle_w.png',
  '/tiles/monsters/goblin_axe_n.png',
  '/tiles/monsters/goblin_axe_e.png',
  '/tiles/monsters/goblin_axe_s.png',
  '/tiles/monsters/goblin_axe_w.png',
  '/tiles/monsters/goblin_dagger_n.png',
  '/tiles/monsters/goblin_dagger_e.png',
  '/tiles/monsters/goblin_dagger_s.png',
  '/tiles/monsters/goblin_dagger_w.png',
  '/tiles/monsters/goblin_sword_n.png',
  '/tiles/monsters/goblin_sword_e.png',
  '/tiles/monsters/goblin_sword_s.png',
  '/tiles/monsters/goblin_sword_w.png',
  '/tiles/monsters/mummy_n.png',
  '/tiles/monsters/mummy_e.png',
  '/tiles/monsters/mummy_s.png',
  '/tiles/monsters/mummy_w.png',
  '/tiles/monsters/orc_cleaver_n.png',
  '/tiles/monsters/orc_cleaver_e.png',
  '/tiles/monsters/orc_cleaver_s.png',
  '/tiles/monsters/orc_cleaver_w.png',
  '/tiles/monsters/orc_mace_n.png',
  '/tiles/monsters/orc_mace_e.png',
  '/tiles/monsters/orc_mace_s.png',
  '/tiles/monsters/orc_mace_w.png',
  '/tiles/monsters/orc_sword_n.png',
  '/tiles/monsters/orc_sword_e.png',
  '/tiles/monsters/orc_sword_s.png',
  '/tiles/monsters/orc_sword_w.png',
  '/tiles/monsters/skeleton_n.png',
  '/tiles/monsters/skeleton_e.png',
  '/tiles/monsters/skeleton_s.png',
  '/tiles/monsters/skeleton_w.png',
  '/tiles/monsters/zombie_n.png',
  '/tiles/monsters/zombie_e.png',
  '/tiles/monsters/zombie_s.png',
  '/tiles/monsters/zombie_w.png',
] as const;

export type MonsterSpritePath = (typeof MonsterSpritePaths)[number];

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

export const monsterSpritePath = (
  monsterType: MonsterType | null,
  direction: Direction | null,
): MonsterSpritePath | null => {
  if (!monsterType || !direction) {
    return null;
  }

  return `/tiles/monsters/${monsterType}_${direction}.png` as MonsterSpritePath;
};
