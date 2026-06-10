import { Movement } from '@hw/prismagen/browser';

export type MovementValue = {
  die: number;
  fixed: number;
};

export type MovementValues = Record<Movement, MovementValue>;
