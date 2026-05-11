import { SpriteOffset } from '../../types/sprite-offset.type';

export const CharacterSpritePaths = [
  '/tiles/characters/barbarian_male_n.png',
  '/tiles/characters/barbarian_male_e.png',
  '/tiles/characters/barbarian_male_s.png',
  '/tiles/characters/barbarian_male_w.png',
  '/tiles/characters/dwarf_male_n.png',
  '/tiles/characters/dwarf_male_e.png',
  '/tiles/characters/dwarf_male_s.png',
  '/tiles/characters/dwarf_male_w.png',
] as const;

export type CharacterSpritePaths = (typeof CharacterSpritePaths)[number];

export const CharacterSpriteSizes: Record<CharacterSpritePaths, SpriteOffset> = {
  '/tiles/characters/barbarian_male_n.png': { x: 60, y: 120 },
  '/tiles/characters/barbarian_male_e.png': { x: 60, y: 120 },
  '/tiles/characters/barbarian_male_s.png': { x: 60, y: 120 },
  '/tiles/characters/barbarian_male_w.png': { x: 60, y: 120 },
  '/tiles/characters/dwarf_male_n.png': { x: 60, y: 120 },
  '/tiles/characters/dwarf_male_e.png': { x: 60, y: 120 },
  '/tiles/characters/dwarf_male_s.png': { x: 60, y: 120 },
  '/tiles/characters/dwarf_male_w.png': { x: 60, y: 120 },
};

export const CharacterSpriteOffsets: Record<CharacterSpritePaths, SpriteOffset> = {
  '/tiles/characters/barbarian_male_n.png': { x: 2, y: -63 },
  '/tiles/characters/barbarian_male_e.png': { x: -1, y: -63 },
  '/tiles/characters/barbarian_male_s.png': { x: -1, y: -63 },
  '/tiles/characters/barbarian_male_w.png': { x: -1, y: -63 },
  '/tiles/characters/dwarf_male_n.png': { x: -1, y: -33 },
  '/tiles/characters/dwarf_male_e.png': { x: -3, y: -33 },
  '/tiles/characters/dwarf_male_s.png': { x: -1, y: -33 },
  '/tiles/characters/dwarf_male_w.png': { x: 3, y: -30 },
};
