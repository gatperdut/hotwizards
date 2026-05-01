import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  controllers: [],
  providers: [],
  imports: [PrismaModule],
  exports: [],
})
export class AdventuresModule {}
