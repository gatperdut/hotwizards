import { Prisma } from '@hw/prismagen/client';
import { HwUser, Paginated } from '@hw/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  public byHandle(handle: string): Promise<HwUser | null> {
    return this.prismaService.user.findUnique({
      where: { handle: handle },
      select: {
        id: true,
        handle: true,
        email: true,
        admin: true,
        createdAt: true,
      },
    });
  }

  public byEmail(email: string): Promise<HwUser | null> {
    return this.prismaService.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        handle: true,
        email: true,
        admin: true,
        createdAt: true,
      },
    });
  }

  public async search(
    term: string = '',
    excludeIds: number[],
    page: number = 0,
    pageSize: number = 10,
  ): Promise<Paginated<HwUser>> {
    const where: Prisma.UserWhereInput = {
      handle: {
        contains: term,
        mode: 'insensitive',
      },
      ...(excludeIds?.length && {
        id: {
          notIn: excludeIds,
        },
      }),
    };

    const users = await this.prismaService.user.findMany({
      where: where,
      skip: page * pageSize,
      take: pageSize,
      orderBy: { handle: 'asc' },
    });

    const total: number = await this.prismaService.user.count({ where: where });

    return {
      items: users.map(
        (user): HwUser => ({
          id: user.id,
          handle: user.handle,
          email: user.email,
          admin: user.admin,
          createdAt: user.createdAt,
        }),
      ),
      meta: {
        page: page || 0,
        pageSize: pageSize || 10,
        total: total,
        pages: Math.ceil(total / (pageSize || 10)),
      },
    };
  }

  public byIdentifier(identifier: string): Promise<(HwUser & { password: string }) | null> {
    return this.prismaService.user.findFirst({
      where: {
        OR: [{ email: identifier }, { handle: identifier }],
      },
      select: {
        id: true,
        handle: true,
        email: true,
        admin: true,
        createdAt: true,
        password: true,
      },
    });
  }

  public me(id: number): Promise<HwUser | null> {
    return this.prismaService.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        handle: true,
        email: true,
        admin: true,
        createdAt: true,
      },
    });
  }

  public byIds(ids: number[]): Promise<HwUser[]> {
    return this.prismaService.user.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        handle: true,
        email: true,
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
      select: {
        id: true,
        handle: true,
        email: true,
        admin: true,
        createdAt: true,
      },
    });
  }
}
