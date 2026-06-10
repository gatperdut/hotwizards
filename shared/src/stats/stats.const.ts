import { Klass } from '@hw/prismagen/browser';
import { MonsterType } from '../dungeon/creatures/monsters/monster-type.const.js';
import { MovementValues } from './movement-values.type.js';

// TODO proper values for monsters
export const AttackDie: Record<Klass | MonsterType, number> = {
  BARBARIAN: 0,
  DWARF: 0,
  ELF: 0,
  WIZARD: 0,
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

// TODO proper values for monsters
export const DefendDie: Record<Klass | MonsterType, number> = {
  BARBARIAN: 1,
  DWARF: 1,
  ELF: 1,
  WIZARD: 1,
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

export const BodyPoints: Record<Klass | MonsterType, number> = {
  BARBARIAN: 8,
  DWARF: 7,
  ELF: 6,
  WIZARD: 4,
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

export const MindPoints: Record<Klass | MonsterType, number> = {
  BARBARIAN: 2,
  DWARF: 3,
  ELF: 4,
  WIZARD: 6,
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

// TODO proper values: monster balanced
export const MovementPoints: Record<Klass | MonsterType, MovementValues> = {
  BARBARIAN: {
    BALANCED: { die: 1, static: 6 },
    REGULAR: { die: 2, static: 0 },
  },
  DWARF: {
    BALANCED: { die: 1, static: 3 },
    REGULAR: { die: 2, static: 0 },
  },
  ELF: {
    BALANCED: { die: 1, static: 5 },
    REGULAR: { die: 2, static: 0 },
  },
  WIZARD: {
    BALANCED: { die: 1, static: 4 },
    REGULAR: { die: 2, static: 0 },
  },
  chaos_mage: {
    BALANCED: { die: 1, static: 3 },
    REGULAR: { die: 0, static: 7 },
  },
  chaos_warrior: {
    BALANCED: { die: 1, static: 3 },
    REGULAR: { die: 0, static: 7 },
  },
  fimir: {
    BALANCED: { die: 1, static: 3 },
    REGULAR: { die: 0, static: 6 },
  },
  gargoyle: {
    BALANCED: { die: 1, static: 3 },
    REGULAR: { die: 0, static: 6 },
  },
  goblin_axe: {
    BALANCED: { die: 1, static: 3 },
    REGULAR: { die: 0, static: 10 },
  },
  goblin_dagger: {
    BALANCED: { die: 1, static: 3 },
    REGULAR: { die: 0, static: 10 },
  },
  goblin_sword: {
    BALANCED: { die: 1, static: 3 },
    REGULAR: { die: 0, static: 10 },
  },
  mummy: {
    BALANCED: { die: 1, static: 3 },
    REGULAR: { die: 0, static: 4 },
  },
  orc_cleaver: {
    BALANCED: { die: 1, static: 3 },
    REGULAR: { die: 0, static: 8 },
  },
  orc_mace: {
    BALANCED: { die: 1, static: 3 },
    REGULAR: { die: 0, static: 8 },
  },
  orc_sword: {
    BALANCED: { die: 1, static: 3 },
    REGULAR: { die: 0, static: 8 },
  },
  skeleton: {
    BALANCED: { die: 1, static: 3 },
    REGULAR: { die: 0, static: 6 },
  },
  zombie: {
    BALANCED: { die: 1, static: 3 },
    REGULAR: { die: 0, static: 5 },
  },
};
