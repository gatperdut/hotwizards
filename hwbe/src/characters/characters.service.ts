import { HwCharacter } from '@hw/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CharactersService {
  constructor(private prismaService: PrismaService) {}

  public async byIds(ids: number[]): Promise<HwCharacter[]> {
    const characters = await this.prismaService.character.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        name: true,
        gender: true,
        klass: true,
        membershipId: true,
      },
    });

    return characters;
  }
}
