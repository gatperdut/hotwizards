import { HwUser } from '@hw/shared';

export type AuthRequest = Request & { user: HwUser };
