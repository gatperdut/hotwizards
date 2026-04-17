import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CampaignsService {
  constructor(private prismaService: PrismaService) {}

  public mine(id: number) {
    // return this.prismaService.user.findUnique({
    //   where: params,
    // });
  }
}
