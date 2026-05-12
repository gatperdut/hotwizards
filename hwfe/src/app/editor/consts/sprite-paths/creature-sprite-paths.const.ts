import { SpriteOffset } from '../../types/sprite-offset.type';
import { CharacterSpritePaths } from './character-sprite-paths.const';
import { MonsterSpritePaths } from './monster-sprite-paths.const';

export const CreatureSpritePaths = [...CharacterSpritePaths, ...MonsterSpritePaths] as const;

export type CreatureSpritePath = (typeof CreatureSpritePaths)[number];

export const CreatureSpriteSizes: Record<CreatureSpritePath, SpriteOffset> = {
  '/tiles/characters/barbarian_male_n.png': { x: 60, y: 120 },
  '/tiles/characters/barbarian_male_e.png': { x: 60, y: 120 },
  '/tiles/characters/barbarian_male_s.png': { x: 60, y: 120 },
  '/tiles/characters/barbarian_male_w.png': { x: 60, y: 120 },
  '/tiles/characters/dwarf_male_n.png': { x: 60, y: 120 },
  '/tiles/characters/dwarf_male_e.png': { x: 60, y: 120 },
  '/tiles/characters/dwarf_male_s.png': { x: 60, y: 120 },
  '/tiles/characters/dwarf_male_w.png': { x: 60, y: 120 },
  '/tiles/monsters/goblin_1_n.png': { x: 60, y: 120 },
  '/tiles/monsters/goblin_1_e.png': { x: 60, y: 120 },
  '/tiles/monsters/goblin_1_s.png': { x: 60, y: 120 },
  '/tiles/monsters/goblin_1_w.png': { x: 60, y: 120 },
  '/tiles/monsters/goblin_2_n.png': { x: 60, y: 120 },
  '/tiles/monsters/goblin_2_e.png': { x: 60, y: 120 },
  '/tiles/monsters/goblin_2_s.png': { x: 60, y: 120 },
  '/tiles/monsters/goblin_2_w.png': { x: 60, y: 120 },
  '/tiles/monsters/goblin_3_n.png': { x: 60, y: 120 },
  '/tiles/monsters/goblin_3_e.png': { x: 60, y: 120 },
  '/tiles/monsters/goblin_3_s.png': { x: 60, y: 120 },
  '/tiles/monsters/goblin_3_w.png': { x: 60, y: 120 },
} as const;

export const CreatureSpriteOffsets: Record<CreatureSpritePath, SpriteOffset> = {
  '/tiles/characters/barbarian_male_n.png': { x: 2, y: -63 },
  '/tiles/characters/barbarian_male_e.png': { x: -1, y: -63 },
  '/tiles/characters/barbarian_male_s.png': { x: -1, y: -63 },
  '/tiles/characters/barbarian_male_w.png': { x: -1, y: -63 },
  '/tiles/characters/dwarf_male_n.png': { x: -1, y: -33 },
  '/tiles/characters/dwarf_male_e.png': { x: -3, y: -33 },
  '/tiles/characters/dwarf_male_s.png': { x: -1, y: -33 },
  '/tiles/characters/dwarf_male_w.png': { x: 3, y: -30 },
  '/tiles/monsters/goblin_1_n.png': { x: 2, y: -63 },
  '/tiles/monsters/goblin_1_e.png': { x: -1, y: -63 },
  '/tiles/monsters/goblin_1_s.png': { x: -1, y: -63 },
  '/tiles/monsters/goblin_1_w.png': { x: -1, y: -63 },
  '/tiles/monsters/goblin_2_n.png': { x: -1, y: -33 },
  '/tiles/monsters/goblin_2_e.png': { x: -3, y: -33 },
  '/tiles/monsters/goblin_2_s.png': { x: -1, y: -33 },
  '/tiles/monsters/goblin_2_w.png': { x: 3, y: -30 },
  '/tiles/monsters/goblin_3_n.png': { x: 3, y: -30 },
  '/tiles/monsters/goblin_3_e.png': { x: 3, y: -30 },
  '/tiles/monsters/goblin_3_s.png': { x: 3, y: -30 },
  '/tiles/monsters/goblin_3_w.png': { x: 3, y: -30 },
} as const;
