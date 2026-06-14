import { Klass, Movement } from '@hw/prismagen/browser';
import { HwInventory } from '../../inventory/inventory.interface.js';
import { HwSlots } from '../../inventory/slots.const.js';
import {
  AttackDie,
  BodyPoints,
  DefendDie,
  MindPoints,
  MovementPoints,
} from '../../stats/base-stats.const.js';
import { ItemAttackDie, ItemDefendDie } from '../../stats/item-stats.const.js';
import { MonsterType } from './monsters/monster-type.const.js';

export const creatureBodyPoints = (key: Klass | MonsterType, inventory: HwInventory): number => {
  return BodyPoints[key];
};

export const creatureMindPoints = (key: Klass | MonsterType, inventory: HwInventory): number => {
  return MindPoints[key];
};

export const creatureAttackDie = (key: Klass | MonsterType, inventory: HwInventory): number => {
  const base = AttackDie[key];

  const gear = HwSlots.map((slot) => {
    const item = inventory.gear[slot];
    if (!item) {
      return 0;
    }
    return ItemAttackDie[item.name];
  }).reduce((prev, curr) => prev + curr, 0);

  return base + gear;
};

export const creatureDefendDie = (key: Klass | MonsterType, inventory: HwInventory): number => {
  const base = DefendDie[key];

  const gear = HwSlots.map((slot) => {
    const item = inventory.gear[slot];
    if (!item) {
      return 0;
    }
    return ItemDefendDie[item.name];
  }).reduce((prev, curr) => prev + curr, 0);

  return base + gear;
};

export const creatureMovementPoints = (
  key: Klass | MonsterType,
  inventory: HwInventory,
  movement: Movement,
): number => {
  const movementValue = MovementPoints[key][movement];

  let result = movementValue.fixed;

  for (let i = 0; i < movementValue.die; i++) {
    result += Math.ceil(Math.random() * 6);
  }

  return result;
};

export const creatureMaxMovementPointsFn = (
  key: Klass | MonsterType,
  inventory: HwInventory,
  movement: Movement,
): string => {
  const movementValue = MovementPoints[key][movement];

  const die = movementValue.die > 0 ? `${movementValue.die}d6` : '';
  const fixed = movementValue.fixed > 0 ? `${movementValue.fixed}` : '';
  const union = die && fixed ? '+' : '';
  return `${die}${union}${fixed}`;
};
