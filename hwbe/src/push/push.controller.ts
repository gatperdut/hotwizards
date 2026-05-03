import { HwUser } from '@hw/shared';
import { Body, Controller, Post } from '@nestjs/common';
import { CurrentUser } from '../users/current-user.decorator.js';
import { PushService } from './push.service.js';

@Controller('push')
export class PushController {
  constructor(private pushService: PushService) {}

  @Post()
  public subscribe(@CurrentUser() user: HwUser, @Body() dto: any): Promise<number> {
    return this.pushService.create(user, dto);
  }
}
