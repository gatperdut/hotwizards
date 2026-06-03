// auth/socket-auth.middleware.ts
import { Server } from 'socket.io';
import { CampaignHwRelations } from '../../campaigns/campaign-to-hw-campaign.js';
import { PrismaService } from '../../prisma/prisma.service.js';

export function applySocketCharacterMiddleware(server: Server, prismaService: PrismaService): void {
  server.use((socket, next): void => {
    const user = socket.user;
    const campaignId = socket.handshake.auth?.campaignId;

    if (!campaignId) {
      return next(new Error('Unauthorized: no campaignId provided'));
    }

    prismaService.campaign
      .findUnique({
        where: {
          id: campaignId,
          OR: [{ masterId: user.id }, { memberships: { some: { userId: user.id } } }],
        },
        ...CampaignHwRelations,
      })
      .then((campaign) => {
        if (!campaign) {
          return next(new Error('Unauthorized: campaign not found'));
        }

        socket.campaignId = campaignId;
        next();
      })
      .catch(() => next(new Error('Unauthorized')));
  });
}
