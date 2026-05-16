import { HwUser } from '../users/user.interface.js';

export interface HwAuthResponse {
  user: HwUser;
  token: string;
}
