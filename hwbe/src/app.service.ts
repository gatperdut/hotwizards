import { User } from '@hw/prismagen/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service.js';

@Injectable()
export class AppService {
  constructor(private prismaService: PrismaService) {
    // Empty
  }

  public async getUser(): Promise<User | null> {
    return await this.prismaService.user.findUnique({ where: { id: 1 } });
  }
}
