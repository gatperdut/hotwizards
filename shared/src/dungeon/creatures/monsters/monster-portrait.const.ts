import { MonsterType } from './monster-type.const.js';

export const monsterPortrait = (type: MonsterType): string => {
  return `/portraits/monsters/${type}.png`;
};
