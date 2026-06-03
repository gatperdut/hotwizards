import { Prisma } from '@hw/prismagen/client';
import { HwCharacter } from '@hw/shared/characters';
import { HwInventory } from '@hw/shared/inventory';

export const CharacterHwRelations = {
  include: {},
} satisfies Prisma.CharacterFindManyArgs;

type CharacterWithHwRelations = Prisma.CharacterGetPayload<typeof CharacterHwRelations>;

export const characterToHwCharacter = (
  character: CharacterWithHwRelations,
  me: boolean,
): HwCharacter => {
  return {
    ...character,
    inventory: character.inventory as unknown as HwInventory,
    me: me,
  };
};
