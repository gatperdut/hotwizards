import { Movement } from '@hw/prismagen/browser';
import { HwSlots } from '../inventory/slots.const.js';
import {
  AttackDie,
  BodyPoints,
  DefendDie,
  MindPoints,
  MovementPoints,
} from '../stats/base-stats.const.js';
import { ItemAttackDie, ItemDefendDie } from '../stats/item-stats.const.js';
import { HwCharacter } from './character.interface.js';

export const characterBodyPoints = (character: HwCharacter): number => {
  return BodyPoints[character.klass];
};

export const characterMindPoints = (character: HwCharacter): number => {
  return MindPoints[character.klass];
};

export const characterAttackDie = (character: HwCharacter): number => {
  const base = AttackDie[character.klass];

  const gear = HwSlots.map((slot) => {
    const item = character.inventory.gear[slot];
    if (!item) {
      return 0;
    }
    return ItemAttackDie[item.name];
  }).reduce((prev, curr) => prev + curr, 0);

  return base + gear;
};

export const characterDefendDie = (character: HwCharacter): number => {
  const base = DefendDie[character.klass];

  const gear = HwSlots.map((slot) => {
    const item = character.inventory.gear[slot];
    if (!item) {
      return 0;
    }
    return ItemDefendDie[item.name];
  }).reduce((prev, curr) => prev + curr, 0);

  return base + gear;
};

export const characterMovementPoints = (character: HwCharacter, movement: Movement): string => {
  const movementValue = MovementPoints[character.klass][movement];

  const die = movementValue.die > 0 ? `${movementValue.die}d6` : '';
  const fixed = movementValue.fixed > 0 ? `${movementValue.fixed}` : '';
  const union = die && fixed ? '+' : '';
  return `${die}${union}${fixed}`;
};
