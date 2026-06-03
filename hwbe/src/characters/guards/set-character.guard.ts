import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { HwRequest } from '../../auth/types/request.type.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CharacterHwRelations, characterToHwCharacter } from '../character-to-hw-character.js';

@Injectable()
export class SetCharacterGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const request = executionContext.switchToHttp().getRequest<HwRequest>();
    const user = request.user;

    const rawCharacterId = request.params?.characterId;
    if (!rawCharacterId || Array.isArray(rawCharacterId)) {
      return false;
    }
    const characterId = parseInt(rawCharacterId);
    if (typeof characterId !== 'number' || Number.isNaN(characterId)) {
      return false;
    }

    const character = await this.prismaService.character.findFirst({
      where: {
        id: characterId,
        membership: { userId: user.id },
      },
      ...CharacterHwRelations,
    });

    if (!character) {
      throw new NotFoundException('Character not found');
    }

    request.character = characterToHwCharacter(character, true);

    return true;
  }
}
