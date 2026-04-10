import { User } from '@hw/prismagen/client';

export type AuthRequest = Request & { user: User };
