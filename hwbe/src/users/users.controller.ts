import { User } from '@hw/prismagen/client';
import {
  PlayerDto,
  UserAvailabilityEmailDto,
  UserAvailabilityHandleDto,
  UserAvailabilityResponseDto,
} from '@hw/shared';
import { Controller, Get, Query } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserCurrent } from './user-current.decorator.js';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  public me(@UserCurrent() user: User) {
    return plainToInstance(PlayerDto, user, { excludeExtraneousValues: true });
  }

  @Get('availability-email')
  public async availabilityEmail(
    @Query() params: UserAvailabilityEmailDto,
  ): Promise<UserAvailabilityResponseDto> {
    return { available: !(await this.usersService.availabilityEmail(params.email)) };
  }

  @Get('availability-handle')
  public async availabilityHandle(
    @Query() params: UserAvailabilityHandleDto,
  ): Promise<UserAvailabilityResponseDto> {
    return { available: !(await this.usersService.availabilityHandle(params.handle)) };
  }
}
