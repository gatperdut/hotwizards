// auth/socket-auth.middleware.ts
import { Server } from 'socket.io';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AdventureHwRelations, adventureToHwAdventure } from '../adventure-to-hw-adventure.js';

export function applySocketAdventureMiddleware(server: Server, prismaService: PrismaService): void {
  server.use((socket, next): void => {
    const user = socket.user;
    const adventureId = socket.handshake.auth?.adventureId;

    if (!adventureId) {
      return next(new Error('Unauthorized'));
    }

    prismaService.adventure
      .findUnique({
        where: {
          id: adventureId,
          campaign: { OR: [{ masterId: user.id }, { memberships: { some: { userId: user.id } } }] },
        },
        ...AdventureHwRelations,
      })
      .then((adventure) => {
        if (!adventure) {
          return next(new Error('Unauthorized'));
        }

        socket.adventure = adventureToHwAdventure(adventure);
        next();
      })
      .catch(() => next(new Error('Unauthorized')));
  });
}
