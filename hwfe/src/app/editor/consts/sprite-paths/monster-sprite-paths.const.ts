import { Direction } from '@hw/shared';

export const MonsterSpritePaths = [
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
  '/tiles/monsters/orc_cleaver_n.png',
  '/tiles/monsters/orc_cleaver_e.png',
  '/tiles/monsters/orc_cleaver_s.png',
  '/tiles/monsters/orc_cleaver_w.png',
  '/tiles/monsters/skeleton_n.png',
  '/tiles/monsters/skeleton_e.png',
  '/tiles/monsters/skeleton_s.png',
  '/tiles/monsters/skeleton_w.png',
] as const;

export type MonsterSpritePath = (typeof MonsterSpritePaths)[number];

export const MonsterTypes = [
  'fimir',
  'gargoyle',
  'goblin_axe',
  'goblin_dagger',
  'goblin_sword',
  'orc_cleaver',
  'skeleton',
] as const;

export type MonsterType = (typeof MonsterTypes)[number];

export const monsterSpritepath = (
  monsterType: MonsterType | null,
  direction: Direction | null,
): MonsterSpritePath | null => {
  if (!monsterType || !direction) {
    return null;
  }

  return `/tiles/monsters/${monsterType}_${direction}.png` as MonsterSpritePath;
};
