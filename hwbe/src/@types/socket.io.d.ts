import { HwAdventure } from '@hw/shared/adventures';
import { HwCampaign } from '@hw/shared/campaigns';
import { HwUser } from '@hw/shared/users';

declare module 'socket.io' {
  interface Socket {
    user: HwUser;
    adventure: HwAdventure;
    campaign: HwCampaign;
  }
}
