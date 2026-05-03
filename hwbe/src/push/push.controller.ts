import { HwUser } from '@hw/shared';
import { Body, Controller, Delete, Post } from '@nestjs/common';
import { PushSubscription } from 'web-push';
import { CurrentUser } from '../users/current-user.decorator.js';
import { PushService } from './push.service.js';

@Controller('push')
export class PushController {
  constructor(private pushService: PushService) {}

  @Post()
  public upsert(@CurrentUser() user: HwUser, @Body() params: PushSubscription): Promise<number> {
    return this.pushService.upsert(user, params);
  }

  @Delete()
  public delete(
    @CurrentUser() user: HwUser,
    @Body() params: { endpoint: string },
  ): Promise<number> {
    return this.pushService.delete(user, params.endpoint);
  }
}
