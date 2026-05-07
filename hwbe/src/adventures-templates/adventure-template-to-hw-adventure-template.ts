import { Prisma } from '@hw/prismagen/client';
import { HwAdventureTemplate, HwMap } from '@hw/shared';

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
    // TODO as unknown? ugh
    map: adventureTemplate.map as unknown as HwMap,
  };
};
