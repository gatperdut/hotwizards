import { Movement } from '@hw/prismagen/browser';

export type MovementValue = {
  die: number;
  static: number;
};

export type MovementValues = Record<Movement, MovementValue>;
