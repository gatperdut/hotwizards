import { Prisma, User } from '@hw/prismagen/client';
import { HwUser, Paginated } from '@hw/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  public async handleAvailable(handle: string): Promise<boolean> {
    return !(await this.prismaService.user.findUnique({
      where: { handle: handle },
    }));
  }

  public async emailAvailable(email: string): Promise<boolean> {
    return !(await this.prismaService.user.findUnique({
      where: { email: email },
    }));
  }

  public async search(
    userId: number,
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
      items: users.map((user): HwUser => {
        const { password, ...strippedUser } = user;
        return { ...strippedUser, me: user.id === userId };
      }),
      meta: {
        page: page || 0,
        pageSize: pageSize || 10,
        total: total,
        pages: Math.ceil(total / (pageSize || 10)),
      },
    };
  }

  public async byIdentifier(identifier: string): Promise<User | null> {
    return await this.prismaService.user.findFirst({
      where: {
        OR: [{ email: identifier }, { handle: identifier }],
      },
    });
  }

  public async create(
    handle: string,
    email: string,
    hashedPassword: string,
    admin: boolean,
  ): Promise<HwUser> {
    const user = await this.prismaService.user.create({
      data: { handle: handle, email: email, password: hashedPassword, admin: admin },
    });

    const { password, ...strippedUser } = user;

    return { ...strippedUser, me: true };
  }
}
