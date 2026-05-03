import { HwUser, PushPayload } from '@hw/shared';
import { Injectable } from '@nestjs/common';
import webpush, { PushSubscription } from 'web-push';
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

  public async notifyUser(user: HwUser, payload: PushPayload): Promise<void> {
    const subscriptions = await this.prismaService.pushSubscription.findMany({
      where: { userId: user.id },
    });

    await Promise.allSettled(
      subscriptions.map((sub) =>
        webpush
          .sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            JSON.stringify(payload),
          )
          .catch(async (err) => {
            if (err.statusCode === 410) {
              await this.prismaService.pushSubscription.delete({
                where: { endpoint: sub.endpoint },
              });
            }
          }),
      ),
    );
  }
}
