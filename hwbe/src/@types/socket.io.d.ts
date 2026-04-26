import { HwUser } from '@hw/shared';

declare module 'socket.io' {
  interface Socket {
    user: HwUser;
  }
}
