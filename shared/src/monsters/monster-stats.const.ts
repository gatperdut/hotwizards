import { MonsterType } from './monster-type.const.js';

export const MonsterAttackDie: Record<MonsterType, number> = {
  chaos_mage: 2,
  chaos_warrior: 4,
  fimir: 3,
  gargoyle: 4,
  goblin_axe: 2,
  goblin_dagger: 2,
  goblin_sword: 2,
  mummy: 3,
  orc_cleaver: 3,
  orc_mace: 3,
  orc_sword: 3,
  skeleton: 2,
  zombie: 2,
};

export const MonsterDefendDie: Record<MonsterType, number> = {
  chaos_mage: 3,
  chaos_warrior: 4,
  fimir: 3,
  gargoyle: 5,
  goblin_axe: 1,
  goblin_dagger: 1,
  goblin_sword: 1,
  mummy: 4,
  orc_cleaver: 2,
  orc_mace: 2,
  orc_sword: 2,
  skeleton: 2,
  zombie: 3,
};

export const MonsterMovementPoints: Record<MonsterType, number> = {
  chaos_mage: 7,
  chaos_warrior: 7,
  fimir: 6,
  gargoyle: 6,
  goblin_axe: 10,
  goblin_dagger: 10,
  goblin_sword: 10,
  mummy: 4,
  orc_cleaver: 8,
  orc_mace: 8,
  orc_sword: 8,
  skeleton: 6,
  zombie: 5,
};

export const MonsterBodyPoints: Record<MonsterType, number> = {
  chaos_mage: 2,
  chaos_warrior: 3,
  fimir: 2,
  gargoyle: 3,
  goblin_axe: 1,
  goblin_dagger: 1,
  goblin_sword: 1,
  mummy: 2,
  orc_cleaver: 1,
  orc_mace: 1,
  orc_sword: 1,
  skeleton: 1,
  zombie: 1,
};

export const MonsterMindPoints: Record<MonsterType, number> = {
  chaos_mage: 5,
  chaos_warrior: 3,
  fimir: 3,
  gargoyle: 4,
  goblin_axe: 1,
  goblin_dagger: 1,
  goblin_sword: 1,
  mummy: 0,
  orc_cleaver: 2,
  orc_mace: 2,
  orc_sword: 2,
  skeleton: 0,
  zombie: 0,
};
