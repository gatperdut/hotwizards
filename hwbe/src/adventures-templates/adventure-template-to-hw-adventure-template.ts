import { Prisma } from '@hw/prismagen/client';
import { HwAdventureTemplate } from '@hw/shared';

export const AdventureTemplateHwRelations = {
  include: {},
} satisfies Prisma.AdventureTemplateDefaultArgs;

type AdventureTemplateWithHwRelations = Prisma.AdventureTemplateGetPayload<
  typeof AdventureTemplateHwRelations
>;

export const adventureTemplateToHwAdventureTemplate = (
  adventureTemplate: AdventureTemplateWithHwRelations,
): HwAdventureTemplate => {
  return {
    id: adventureTemplate.id,
    name: adventureTemplate.name,
  };
};
