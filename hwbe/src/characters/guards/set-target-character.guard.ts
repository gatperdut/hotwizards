import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { HwRequest } from '../../auth/types/request.type.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CharacterHwRelations, characterToHwCharacter } from '../character-to-hw-character.js';

@Injectable()
export class SetTargetCharacterGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const request = executionContext.switchToHttp().getRequest<HwRequest>();
    const campaign = request.campaign;

    const rawTargetCharacterId = request.params?.targetCharacterId;
    if (!rawTargetCharacterId || Array.isArray(rawTargetCharacterId)) {
      return false;
    }
    const targetCharacterId = parseInt(rawTargetCharacterId);
    if (typeof targetCharacterId !== 'number' || Number.isNaN(targetCharacterId)) {
      return false;
    }

    const targetCharacter = await this.prismaService.character.findFirst({
      where: {
        id: targetCharacterId,
        membership: {
          campaignId: campaign.id,
        },
      },
      ...CharacterHwRelations,
    });

    if (!targetCharacter) {
      throw new NotFoundException('Target character not found');
    }

    request.targetCharacter = characterToHwCharacter(targetCharacter, true);

    return true;
  }
}
