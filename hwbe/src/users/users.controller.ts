import { Controller, Get, Query } from '@nestjs/common';
import { UserAvailabilityHandleDto } from './dto/user-availability-display-name.dto.js';
import { UserAvailabilityEmailDto } from './dto/user-availability-email.dto.js';
import { UserAvailabilityResponseDto } from './dto/user-availability-response.dto.js';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
    // Empty
  }

  @Get('availability-email')
  public async availabilityEmail(
    @Query() params: UserAvailabilityEmailDto,
  ): Promise<UserAvailabilityResponseDto> {
    return { available: !(await this.usersService.availabilityEmail(params)) };
  }

  @Get('availability-display-name')
  public async availabilityHandle(
    @Query() params: UserAvailabilityHandleDto,
  ): Promise<UserAvailabilityResponseDto> {
    return { available: !(await this.usersService.availabilityHandle(params)) };
  }
}
