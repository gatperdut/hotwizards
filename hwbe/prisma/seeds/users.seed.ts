import * as bcrypt from 'bcrypt';
import { PrismaClient } from '../generated/prisma/client';

type NamedUserSeed = {
  handle: string;
  initials: string;
};

export async function seedUsers(prisma: PrismaClient): Promise<void> {
  const salt: string = await bcrypt.genSalt();

  const namedUserSeeds: NamedUserSeed[] = [
    {
      handle: 'Carlos',
      initials: 'crb',
    },
    {
      handle: 'Josep',
      initials: 'jam',
    },
    {
      handle: 'Javi',
      initials: 'jps',
    },
    {
      handle: 'Vicent',
      initials: 'vfg',
    },
    {
      handle: 'Victor',
      initials: 'vps',
    },
  ];

  for (const namedUserSeed of namedUserSeeds) {
    const email: string = `${namedUserSeed.initials}@gmail.com`;

    await prisma.user.upsert({
      where: { email: email },
      update: {},
      create: {
        email: email,
        handle: namedUserSeed.handle,
        password: await bcrypt.hash(`${namedUserSeed.initials}${namedUserSeed.initials}`, salt),
      },
    });
  }

  for (let i: number = 0; i < 10; i++) {
    const email: string = `email${i}@gmail.com`;

    await prisma.user.upsert({
      where: { email: email },
      update: {},
      create: {
        email: email,
        handle: `User ${i}`,
        password: await bcrypt.hash(`password${i}`, salt),
      },
    });
  }
}
