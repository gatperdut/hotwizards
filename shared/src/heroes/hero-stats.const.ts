import { Klass } from '@hw/prismagen/browser';

export const HeroAttackDie: Record<Klass, number> = {
  BARBARIAN: 3,
  DWARF: 2,
  ELF: 2,
  WIZARD: 1,
};

export const HeroDefendDie: Record<Klass, number> = {
  BARBARIAN: 2,
  DWARF: 2,
  ELF: 2,
  WIZARD: 2,
};

export const HeroMovementPoints: Record<Klass, number> = {
  BARBARIAN: 7,
  DWARF: 7,
  ELF: 7,
  WIZARD: 7,
};

export const HeroBodyPoints: Record<Klass, number> = {
  BARBARIAN: 8,
  DWARF: 7,
  ELF: 6,
  WIZARD: 4,
};

export const HeroMindPoints: Record<Klass, number> = {
  BARBARIAN: 2,
  DWARF: 3,
  ELF: 4,
  WIZARD: 6,
};
