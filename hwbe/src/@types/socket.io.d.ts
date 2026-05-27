import { HwAdventure } from '@hw/shared/adventures';
import { HwUser } from '@hw/shared/users';

declare module 'socket.io' {
  interface Socket {
    user: HwUser;
    adventure: HwAdventure;
    master: HwUser;
  }
}
