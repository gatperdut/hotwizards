import { HwMe } from '../shared/me.interface.js';

export interface HwUser extends HwMe {
  id: number;
  handle: string;
  email: string;
  admin: boolean;
  createdAt: Date;
}
