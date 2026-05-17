import { BaseSpritePath } from '@hw/shared/sprites';

export const spritePathDisplayFn = (baseSpritePath: BaseSpritePath): string =>
  baseSpritePath?.split('/').pop()?.split('.')[0] as string;
