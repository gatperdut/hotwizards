import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AdventureHwRelations, adventureToHwAdventure } from '../adventure-to-hw-adventure.js';

@Injectable()
export class SetAdventureWsGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const client = executionContext.switchToWs().getClient<Socket>();
    const user = client.user;

    const rawAdventureId: any = client.adventureId;
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
      throw new WsException('Adventure not found');
    }

    client.adventure = adventureToHwAdventure(adventure, user.id);

    return true;
  }
}
