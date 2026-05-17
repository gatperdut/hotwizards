import { BaseSpritePaths } from './base-sprites.const.js';
import { CreatureSpritePaths } from './creature-sprites.const.js';
import { DoorSpritePaths } from './door-sprites.const.js';
import { FeatureSpritePaths } from './feature-sprites.const.js';
import { FeatureTrapSpritePaths } from './feature-trap-sprites.const.js';
import { FloorTrapSpritePaths } from './floor-trap-sprites.const.js';
import { SpawnSpritePaths } from './spawn-sprites.const.js';

export const SpritePaths = [
  ...BaseSpritePaths,
  ...FeatureSpritePaths,
  ...FeatureTrapSpritePaths,
  ...DoorSpritePaths,
  ...CreatureSpritePaths,
  ...FloorTrapSpritePaths,
  ...SpawnSpritePaths,
] as const;

export type SpritePath = (typeof SpritePaths)[number];
