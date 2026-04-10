import {
  UserAvailabilityEmailDto,
  UserAvailabilityHandleDto,
  UserByEmailDto,
  UserByIdDto,
  UserCreateDto,
} from '@hw/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

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

  public byEmail(params: UserByEmailDto) {
    return this.prismaService.user.findUnique({
      where: params,
    });
  }

  public byId(params: UserByIdDto) {
    return this.prismaService.user.findUnique({ where: params });
  }

  public create(params: UserCreateDto) {
    return this.prismaService.user.create({ data: params });
  }
}
