export const spritePathDisplayFn = (baseSpritePath: string): string =>
  baseSpritePath?.split('/').pop()?.split('.')[0] as string;
