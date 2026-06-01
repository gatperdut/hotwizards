import { HwCreature } from './creature.interface.js';

export const creatureAt = (
  creatures: HwCreature[],
  x: number,
  y: number,
): HwCreature | undefined => {
  return creatures.find((c) => c.x === x && c.y === y);
};
