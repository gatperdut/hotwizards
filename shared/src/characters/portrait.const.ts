import { Gender, Klass } from '@hw/prismagen/client';

export const portrait = (klass: Klass, gender: Gender): string => {
  return `/portraits/${klass.toLowerCase()}_${gender.toLowerCase()}.png`;
};
