import {
  HwUser,
  HwUserAvailabilityEmailDto,
  HwUserAvailabilityHandleDto,
  HwUserAvailabilityResponse,
  HwUserExt,
  HwUsersByIdsDto,
  HwUserSearchDto,
  Paginated,
} from '@hw/shared';
import { Controller, Get, Query } from '@nestjs/common';
import { UserCurrent } from './user-current.decorator.js';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  public me(@UserCurrent() user: HwUser): HwUser {
    return user;
  }

  @Get()
  public search(@Query() params: HwUserSearchDto): Promise<Paginated<HwUserExt>> {
    return this.usersService.search(params.term, params.page, params.pageSize);
  }

  @Get('by-ids')
  public byIds(@Query() params: HwUsersByIdsDto): Promise<HwUserExt[]> {
    return this.usersService.byIds(params.ids);
  }

  @Get('availability-email')
  public async availabilityEmail(
    @Query() params: HwUserAvailabilityEmailDto,
  ): Promise<HwUserAvailabilityResponse> {
    return { available: !(await this.usersService.byEmail(params.email)) };
  }

  @Get('availability-handle')
  public async availabilityHandle(
    @Query() params: HwUserAvailabilityHandleDto,
  ): Promise<HwUserAvailabilityResponse> {
    return { available: !(await this.usersService.byHandle(params.handle)) };
  }
}
