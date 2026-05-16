import { HwUser } from '@hw/shared/user';

declare module 'express' {
  interface Request {
    user: HwUser | null;
  }
}
