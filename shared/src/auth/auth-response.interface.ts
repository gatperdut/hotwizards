import { HwUser } from '@hw/shared';

export interface HwAuthResponse {
  user: HwUser;
  token: string;
}
