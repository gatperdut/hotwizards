import { Gender, Klass } from '@hw/prismagen/client';

export const characterPortrait = (klass: Klass, gender: Gender): string => {
  return `/portraits/characters/${klass.toLowerCase()}_${gender.toLowerCase()}.png`;
};
