import { GroundSpritePaths } from './ground-sprite-paths.const';
import { WaterSpritePaths } from './water-sprite-paths.const';

export const BaseSpritePaths = [...GroundSpritePaths, ...WaterSpritePaths];

export type BaseSpritePath = (typeof BaseSpritePaths)[number];
