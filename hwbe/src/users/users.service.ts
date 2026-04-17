import { HwUser, HwUserExt } from '@hw/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  public availabilityHandle(handle: string) {
    return this.prismaService.user.findUnique({
      where: { handle: handle },
    });
  }

  public availabilityEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email: email },
    });
  }

  public byIdentifier(identifier: string) {
    return this.prismaService.user.findFirst({
      where: {
        OR: [{ email: identifier }, { handle: identifier }],
      },
    });
  }

  public me(id: number): Promise<HwUser | null> {
    return this.prismaService.user.findUnique({
      where: { id: id },
      select: { id: true, handle: true, email: true, admin: true, createdAt: true },
    });
  }

  public byIds(ids: number[]): Promise<HwUserExt[]> {
    return this.prismaService.user.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        handle: true,
        admin: true,
        createdAt: true,
      },
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
    });
  }
}
