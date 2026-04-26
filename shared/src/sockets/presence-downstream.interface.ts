import { HwUser } from '../users/user.interface.js';

export interface PresenceDownstream {
  downOnline: (user: HwUser) => void;
  downOnlineList: (users: HwUser[]) => void;
  downOffline: (user: HwUser) => void;
}
