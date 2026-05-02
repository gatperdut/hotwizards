import { Prisma } from '@hw/prismagen/client';
import { Paginated } from '@hw/shared';
import { Injectable } from '@nestjs/common';
import { HwAdventureTemplate } from '../../../shared/dist/shared/src/adventure-templates/adventure-template.interface.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AdventureTemplatesService {
  constructor(private prismaService: PrismaService) {}

  public async search(
    term: string = '',
    page: number = 0,
    pageSize: number = 10,
  ): Promise<Paginated<HwAdventureTemplate>> {
    const where: Prisma.AdventureTemplateWhereInput = {
      OR: [
        {
          name: {
            contains: term,
            mode: 'insensitive',
          },
        },
      ],
    };

    const adventureTemplates = await this.prismaService.adventureTemplate.findMany({
      where: where,
      skip: page * pageSize,
      take: pageSize,
      orderBy: { name: 'asc' },
    });

    const total: number = await this.prismaService.adventureTemplate.count({ where: where });

    return {
      items: adventureTemplates,
      meta: {
        page: page || 0,
        pageSize: pageSize || 10,
        total: total,
        pages: Math.ceil(total / (pageSize || 10)),
      },
    };
  }
}
