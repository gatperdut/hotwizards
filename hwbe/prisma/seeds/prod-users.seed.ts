import { PrismaClient } from '@hw/prismagen/client';
import * as bcrypt from 'bcrypt';

type NamedProdUserSeed = {
  handle: string;
  initials: string;
};

export async function seedProdUsers(prismaClient: PrismaClient): Promise<void> {
  const salt: string = await bcrypt.genSalt();

  const namedUserSeeds: NamedProdUserSeed[] = [
    {
      handle: 'Carlos',
      initials: 'crb',
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
        admin: true,
        password: await bcrypt.hash(`${namedUserSeed.initials.repeat(3)}`, salt),
      },
    });
  }
}
