import { HwDungeon } from '../dungeon.interface.js';

export const endTurnHero = (
  dungeon: HwDungeon,
  heroId: number,
  actionPoints: number,
  movementPoints: number,
): void => {
  dungeon.heroes = dungeon.heroes.map((hero) => {
    if (heroId !== hero.id) {
      return hero;
    }

    return {
      ...hero,
      actionPoints: actionPoints,
      movementPoints: movementPoints,
      maxMovementPoints: movementPoints,
    };
  });
};
