import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { HwRequest } from '../../auth/types/request.type.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  AdventureTemplateHwRelations,
  adventureTemplateToHwAdventureTemplate,
} from '../adventure-template-to-hw-adventure-template.js';

@Injectable()
export class SetAdventureTemplateGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const request = executionContext.switchToHttp().getRequest<HwRequest>();

    const rawAdventureTemplateId = request.params?.adventureTemplateId;
    if (!rawAdventureTemplateId || Array.isArray(rawAdventureTemplateId)) {
      return false;
    }

    const adventureTemplateId = parseInt(rawAdventureTemplateId);
    if (typeof adventureTemplateId !== 'number' || Number.isNaN(adventureTemplateId)) {
      return false;
    }
    const adventureTemplate = await this.prismaService.adventureTemplate.findFirst({
      where: {
        id: adventureTemplateId,
      },
      ...AdventureTemplateHwRelations,
    });

    if (!adventureTemplate) {
      throw new NotFoundException('Adventure template not found');
    }

    request.adventureTemplate = adventureTemplateToHwAdventureTemplate(adventureTemplate);

    return true;
  }
}
