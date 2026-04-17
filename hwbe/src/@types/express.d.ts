import { HwUser } from '@hw/shared';

declare module 'express' {
  interface Request {
    user: HwUser | null;
  }
}
