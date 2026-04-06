import { User } from '@hw/prismagen/client';
import { AppUser } from '@hw/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service.js';

@Injectable()
export class AppService {
  constructor(private prismaService: PrismaService) {
    // Empty
  }

  public getHello(): { greeting: string } {
    return { greeting: 'Hello World!' };
  }

  public getError(): void {
    throw new Error('HWBE error');
  }

  public async getUser(): Promise<User | null> {
    return await this.prismaService.user.findUnique({ where: { id: 1 } });
  }

  private user: AppUser | undefined;
}
