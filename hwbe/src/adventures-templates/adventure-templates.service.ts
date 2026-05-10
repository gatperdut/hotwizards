import { Prisma } from '@hw/prismagen/client';
import { HwAdventureTemplate, Paginated } from '@hw/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { adventureTemplateToHwAdventureTemplate } from './adventure-template-to-hw-adventure-template.js';

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
      items: adventureTemplates.map((at) => adventureTemplateToHwAdventureTemplate(at)),
      meta: {
        page: page || 0,
        pageSize: pageSize || 10,
        total: total,
        pages: Math.ceil(total / (pageSize || 10)),
      },
    };
  }

  public async update(
    adventureTemplate: HwAdventureTemplate,
    name: string,
    info: string,
    dungeon: object,
  ): Promise<number> {
    await this.prismaService.adventureTemplate.update({
      where: { id: adventureTemplate.id },
      data: { name: name, dungeon: dungeon },
    });

    // TODO deal with ws
    // this.adventureTemplatesGateway.handleDownUpdateAdventureTemplate(adventureTemplate.id);

    return adventureTemplate.id;
  }
}
