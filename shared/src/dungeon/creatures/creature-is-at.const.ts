import { HwCreature } from './creature.interface.js';

export const creatureIsAt = (
  creature: Pick<HwCreature, 'x' | 'y'>,
  x: number,
  y: number,
): boolean => {
  return creature.x === x && creature.y === y;
};
