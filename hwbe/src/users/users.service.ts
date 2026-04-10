import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserAvailabilityHandleDto } from './dto/user-availability-display-name.dto.js';
import { UserAvailabilityEmailDto } from './dto/user-availability-email.dto.js';

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
}
