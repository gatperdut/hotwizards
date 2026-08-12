import { PrismaClient } from '@hw/prismagen/client';
import * as bcrypt from 'bcrypt';

type NamedDevUserSeed = {
  handle: string;
  initials: string;
  admin: boolean;
};

export async function seedDevUsers(prismaClient: PrismaClient): Promise<void> {
  const salt: string = await bcrypt.genSalt();

  const namedUserSeeds: NamedDevUserSeed[] = [
    {
      handle: 'Carlos',
      initials: 'crb',
      admin: true,
    },
    {
      handle: 'Josep',
      initials: 'jam',
      admin: false,
    },
    {
      handle: 'Javi',
      initials: 'jps',
      admin: false,
    },
    {
      handle: 'Vicent',
      initials: 'vfg',
      admin: false,
    },
    {
      handle: 'Victor',
      initials: 'vps',
      admin: false,
    },
  ];

  for (const namedUserSeed of namedUserSeeds) {
    const email: string = `${namedUserSeed.initials}@gmail.com`;

    await prismaClient.user.upsert({
      where: { email: email },
      update: {},
      create: {
        email: email,
        handle: namedUserSeed.handle,
        admin: namedUserSeed.admin,
        password: await bcrypt.hash(`${namedUserSeed.initials.repeat(3)}`, salt),
      },
    });
  }

  for (let i: number = 0; i < 10; i++) {
    const email: string = `email${i}@gmail.com`;

    await prismaClient.user.upsert({
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
