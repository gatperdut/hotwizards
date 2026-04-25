import {
  HwUser,
  HwUserAvailabilityEmailDto,
  HwUserAvailabilityHandleDto,
  HwUserSearchDto,
  Paginated,
} from '@hw/shared';
import { Controller, Get, Query } from '@nestjs/common';
import { CurrentUser } from './current-user.decorator.js';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  public me(@CurrentUser() hwUser: HwUser): HwUser {
    return hwUser;
  }

  @Get()
  public search(
    @CurrentUser() hwUser: HwUser,
    @Query() params: HwUserSearchDto,
  ): Promise<Paginated<HwUser>> {
    return this.usersService.search(
      hwUser.id,
      params.term,
      params?.excludeIds || [],
      params.page,
      params.pageSize,
    );
  }

  @Get('email-available')
  public async emailAvailable(@Query() params: HwUserAvailabilityEmailDto): Promise<boolean> {
    return await this.usersService.emailAvailable(params.email);
  }

  @Get('handle-available')
  public async handleAvailable(@Query() params: HwUserAvailabilityHandleDto): Promise<boolean> {
    return await this.usersService.handleAvailable(params.handle);
  }
}
