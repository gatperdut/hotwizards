import { HwMembership } from '@hw/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { MembershipSelect } from './membership.select.js';

@Injectable()
export class MembershipsService {
  constructor(private prismaService: PrismaService) {}

  public byIds(ids: number[]): Promise<HwMembership[]> {
    return this.prismaService.membership.findMany({
      where: { id: { in: ids } },
      select: MembershipSelect,
    });
  }
}
