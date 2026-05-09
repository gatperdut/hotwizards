import { FloorSpritePaths } from './floor-sprite-paths.const';
import { WaterSpritePaths } from './water-sprite-paths.const';

export const BaseSpritePaths = [...FloorSpritePaths, ...WaterSpritePaths];

export type BaseSpritePath = (typeof BaseSpritePaths)[number];
