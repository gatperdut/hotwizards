import { HwUser } from '@hw/shared';
import { Injectable } from '@nestjs/common';
import { PushSubscription } from 'web-push';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PushService {
  constructor(private prismaService: PrismaService) {}

  public async upsert(user: HwUser, subscriptionDto: PushSubscription): Promise<number> {
    const subscription = await this.prismaService.pushSubscription.upsert({
      where: { endpoint: subscriptionDto.endpoint },
      update: { p256dh: subscriptionDto.keys.p256dh, auth: subscriptionDto.keys.auth },
      create: {
        userId: user.id,
        endpoint: subscriptionDto.endpoint,
        p256dh: subscriptionDto.keys.p256dh,
        auth: subscriptionDto.keys.auth,
      },
    });

    return subscription.id;
  }

  public async delete(user: HwUser, endpoint: string): Promise<number> {
    const subscription = await this.prismaService.pushSubscription.delete({
      where: { userId: user.id, endpoint: endpoint },
    });

    return subscription.id;
  }
}
