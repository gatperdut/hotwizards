import { Direction } from '@hw/shared';

export const MonsterSpritePaths = [
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
] as const;

export type MonsterSpritePath = (typeof MonsterSpritePaths)[number];

export const MonsterTypes = ['goblin_axe', 'goblin_dagger', 'goblin_sword'] as const;

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
