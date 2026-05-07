import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { HwRequest } from '../../auth/types/request.type.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AdventureHwRelations, adventureToHwAdventure } from '../adventure-to-hw-adventure.js';

@Injectable()
export class SetAdventureGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const request = executionContext.switchToHttp().getRequest<HwRequest>();
    const user = request.user;

    const rawAdventureId = request.params?.adventureId;
    if (!rawAdventureId || Array.isArray(rawAdventureId)) {
      return false;
    }
    const adventureId = parseInt(rawAdventureId);
    if (typeof adventureId !== 'number' || Number.isNaN(adventureId)) {
      return false;
    }

    const adventure = await this.prismaService.adventure.findFirst({
      where: {
        id: adventureId,
        campaign: { OR: [{ masterId: user.id }, { memberships: { some: { userId: user.id } } }] },
      },
      ...AdventureHwRelations,
    });

    if (!adventure) {
      throw new NotFoundException('Adventure not found');
    }

    request.adventure = adventureToHwAdventure(adventure);

    return true;
  }
}
