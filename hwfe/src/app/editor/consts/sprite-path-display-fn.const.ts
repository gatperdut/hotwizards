import { BaseSpritePath } from './sprite-paths/base-sprite-paths.const';

export const spritePathDisplayFn = (baseSpritePath: BaseSpritePath): string =>
  baseSpritePath?.split('/').pop()?.split('.')[0] as string;
