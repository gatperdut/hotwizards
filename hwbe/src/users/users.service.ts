import { HwUser, HwUserExt } from '@hw/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserExtSelect } from './user-ext.select.js';
import { UserSelect } from './user.select.js';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  public byHandle(handle: string): Promise<HwUserExt | null> {
    return this.prismaService.user.findUnique({
      where: { handle: handle },
      select: UserExtSelect,
    });
  }

  public byEmail(email: string): Promise<HwUserExt | null> {
    return this.prismaService.user.findUnique({
      where: { email: email },
      select: UserExtSelect,
    });
  }

  public byIdentifier(identifier: string): Promise<(HwUser & { password: string }) | null> {
    return this.prismaService.user.findFirst({
      where: {
        OR: [{ email: identifier }, { handle: identifier }],
      },
      select: { ...UserSelect, password: true },
    });
  }

  public me(id: number): Promise<HwUser | null> {
    return this.prismaService.user.findUnique({
      where: { id: id },
      select: UserSelect,
    });
  }

  public byIds(ids: number[]): Promise<HwUserExt[]> {
    return this.prismaService.user.findMany({
      where: { id: { in: ids } },
      select: UserExtSelect,
    });
  }

  public create(
    handle: string,
    email: string,
    hashedPassword: string,
    admin: boolean,
  ): Promise<HwUser> {
    return this.prismaService.user.create({
      data: { handle: handle, email: email, password: hashedPassword, admin: admin },
      select: UserSelect,
    });
  }
}
