import { UserAvailabilityEmailDto, UserAvailabilityHandleDto } from '@hw/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserCreateDto } from './types/user-create.type.js';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {
    // Empty
  }

  public availabilityHandle(params: UserAvailabilityHandleDto) {
    return this.prismaService.user.findUnique({
      where: params,
    });
  }

  public availabilityEmail(params: UserAvailabilityEmailDto) {
    return this.prismaService.user.findUnique({
      where: params,
    });
  }

  public byIdentifier(identifier: string) {
    return this.prismaService.user.findFirst({
      where: {
        OR: [{ email: identifier }, { handle: identifier }],
      },
    });
  }

  public byId(id: number) {
    return this.prismaService.user.findUnique({ where: { id: id } });
  }

  public create(params: UserCreateDto) {
    return this.prismaService.user.create({ data: params });
  }
}
