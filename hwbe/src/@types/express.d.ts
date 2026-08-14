import { HwUser } from '@hw/shared/users';

declare module 'express' {
  interface Request {
    user: HwUser | null;
  }
}
