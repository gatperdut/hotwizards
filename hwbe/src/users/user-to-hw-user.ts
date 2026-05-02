import { Prisma } from '@hw/prismagen/client';
import { HwUser } from '@hw/shared';

export const UserHwRelations = {
  include: {},
} satisfies Prisma.UserDefaultArgs;

type UserWithHwRelations = Prisma.UserGetPayload<typeof UserHwRelations>;

export const userToHwUser = (user: UserWithHwRelations, userId: number): HwUser => {
  const { password, ...strippedUser } = user;

  return {
    ...strippedUser,
    me: user.id === userId,
  };
};
