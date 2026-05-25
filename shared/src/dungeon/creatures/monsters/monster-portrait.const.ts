import { MonsterType } from './monster-type.const.js';

// TODO rename to characterPortrait?
export const monsterPortrait = (type: MonsterType): string => {
  return `/portraits/monsters/${type}.png`;
};
