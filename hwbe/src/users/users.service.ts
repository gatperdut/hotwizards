import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserAvailabilityHandleDto } from './dto/user-availability-display-name.dto.js';
import { UserAvailabilityEmailDto } from './dto/user-availability-email.dto.js';
import { UserByEmailDto } from './dto/user-by-email.dto.js';
import { UserByIdDto } from './dto/user-by-id.dto.js';
import { UserCreateDto } from './dto/user-create.dto.js';

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
