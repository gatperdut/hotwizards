import { BaseSpritePaths } from './base-sprites.const.js';
import { CreatureSpritePaths } from './creature-sprites.const.js';
import { DoorSpritePaths } from './door-sprites.const.js';
import { FeatureSpritePaths } from './feature-sprites.const.js';

export const SpritePaths = [
  ...BaseSpritePaths,
  ...FeatureSpritePaths,
  ...DoorSpritePaths,
  ...CreatureSpritePaths,
] as const;

export type SpritePath = (typeof SpritePaths)[number];
