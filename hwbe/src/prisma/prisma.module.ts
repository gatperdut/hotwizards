import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service.js';

@Module({
  controllers: [],
  providers: [PrismaService],
  imports: [ConfigModule],
  exports: [PrismaService],
})
export class PrismaModule {}
