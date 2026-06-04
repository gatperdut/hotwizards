import { HwUser } from '@hw/shared/users';

declare module 'socket.io' {
  interface Socket {
    user: HwUser;
    campaignId: number;
  }
}
