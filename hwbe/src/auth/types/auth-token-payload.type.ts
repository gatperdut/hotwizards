import * as jwt from 'jsonwebtoken';

export type AuthTokenPayload = jwt.JwtPayload & {
  userId: number;
};
