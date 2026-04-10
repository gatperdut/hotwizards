import { User } from 'src/generated/client';

declare module 'express' {
  interface Request {
    user?: User;
  }
}
