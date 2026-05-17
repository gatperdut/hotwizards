import { HeroSpritePaths } from './hero-sprites.const.js';
import { MonsterSpritePaths } from './monster-sprites.const.js';

export const CreatureSpritePaths = [...HeroSpritePaths, ...MonsterSpritePaths] as const;

export type CreatureSpritePath = (typeof CreatureSpritePaths)[number];
