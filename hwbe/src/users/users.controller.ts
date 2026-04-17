import {
  HwUser,
  HwUserExt,
  UserAvailabilityEmailDto,
  UserAvailabilityHandleDto,
  UserAvailabilityResponse,
  UsersByIdsDto,
} from '@hw/shared';
import { Controller, Get, Query } from '@nestjs/common';
import { UserCurrent } from './user-current.decorator.js';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  public me(@UserCurrent() user: HwUser): HwUser {
    return user;
  }

  @Get('by-ids')
  public byIds(@Query() params: UsersByIdsDto): Promise<HwUserExt[]> {
    return this.usersService.byIds(params.ids);
  }

  @Get('availability-email')
  public async availabilityEmail(
    @Query() params: UserAvailabilityEmailDto,
  ): Promise<UserAvailabilityResponse> {
    return { available: !(await this.usersService.availabilityEmail(params.email)) };
  }

  @Get('availability-handle')
  public async availabilityHandle(
    @Query() params: UserAvailabilityHandleDto,
  ): Promise<UserAvailabilityResponse> {
    return { available: !(await this.usersService.availabilityHandle(params.handle)) };
  }
}
