import { HwUser } from '@hw/shared';
import { Injectable } from '@nestjs/common';
import { PushSubscription } from 'web-push';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PushService {
  constructor(private prismaService: PrismaService) {}

  public async create(user: HwUser, dto: PushSubscription): Promise<number> {
    const pushSubscription = await this.prismaService.pushSubscription.upsert({
      where: { endpoint: dto.endpoint },
      update: { p256dh: dto.keys.p256dh, auth: dto.keys.auth },
      create: {
        userId: user.id,
        endpoint: dto.endpoint,
        p256dh: dto.keys.p256dh,
        auth: dto.keys.auth,
      },
    });

    return pushSubscription.id;
  }
}
