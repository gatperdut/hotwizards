// auth/socket-auth.middleware.ts
import { PrismaService } from '@hw/hwbe/prisma/prisma.service.js';
import { Server } from 'socket.io';
import { AuthService } from '../auth.service.js';

export function applyAuthWsMiddleware(
  server: Server,
  authService: AuthService,
  prismaService: PrismaService,
  fetchCampaign: boolean,
): void {
  server.use((socket, next) => {
    const token = socket.handshake.auth?.token?.split(' ')[1];
    if (!token) {
      return next(new Error('Unauthorized: token is not provided'));
    }

    const campaignId = socket.handshake.auth?.campaignId;
    if (fetchCampaign && !campaignId) {
      return next(new Error('Unauthorized: campaignId is not provided'));
    }

    authService
      .userFromToken(token)
      .then((user) => {
        if (!user) {
          throw new Error('Authorization token is invalid');
        }
        socket.user = user;

        if (!fetchCampaign) {
          return;
        }

        return prismaService.campaign
          .findUnique({
            where: {
              id: campaignId,
              OR: [{ masterId: user.id }, { memberships: { some: { userId: user.id } } }],
            },
          })
          .then((campaign) => {
            if (!campaign) {
              throw new Error('Unauthorized: campaign not found');
            }
            socket.campaignId = campaignId;
          });
      })
      .then(() => next())
      .catch((err) => next(new Error(err?.message ?? 'Unauthorized')));
  });
}
